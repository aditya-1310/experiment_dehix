'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LoaderCircle, MessageSquare } from 'lucide-react';
import { DocumentData } from 'firebase/firestore';

import Header from '@/components/header/header';
import SidebarMenu from '@/components/menu/sidebarMenu';
import { CardsChat } from '@/components/shared/chat';
import ChatLayout from '@/components/shared/ChatLayout';
import { ChatList } from '@/components/shared/chatList';

import {
  menuItemsBottom as businessMenuItemsBottom,
  menuItemsTop as businessMenuItemsTop,
} from '@/config/menuItems/business/dashboardMenuItems';

import {
  menuItemsBottom,
  menuItemsTop,
  chatsMenu,
} from '@/config/menuItems/freelancer/dashboardMenuItems';

import { subscribeToUserConversations } from '@/utils/common/firestoreUtils';
import { RootState } from '@/lib/store';

interface Conversation extends DocumentData {
  id: string;
  participants: string[];
  timestamp?: string;
  lastMessage?: any;
}

const HomePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const toggleChatExpanded = () => setIsChatExpanded(prev => !prev);

  // Load conversations on mount
  useEffect(() => {
    if (!user.uid) return;

    let unsubscribe: () => void;

    const fetchConversations = async () => {
      setLoading(true);
      unsubscribe = await subscribeToUserConversations(
        'conversations',
        user.uid,
        (data) => {
          const typedData = data as Conversation[];
          setConversations(typedData);
          setLoading(false);
        }
      );
    };

    fetchConversations();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user.uid]);

  // Set default active conversation once conversations load
  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  // Chat List (Left Panel)
  const chatListComponentContent = loading ? (
    <div className="flex justify-center items-center h-full">
      <LoaderCircle className="h-6 w-6 text-[hsl(var(--primary))] animate-spin" />
    </div>
  ) : conversations.length > 0 ? (
    <ChatList
      conversations={conversations}
      active={activeConversation}
      setConversation={setActiveConversation}
    />
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-center text-[hsl(var(--muted-foreground))] p-4">
      <MessageSquare className="w-10 h-10 mb-2" />
      <p className="text-lg font-medium">No conversations</p>
      <p className="text-sm">New chats will appear here.</p>
    </div>
  );

  // Chat Window (Right Panel)
  const chatWindowComponentContent = loading && !activeConversation ? (
    <div className="flex flex-col h-full items-center justify-center bg-[hsl(var(--card))] rounded-lg shadow-sm dark:shadow-none">
      <LoaderCircle className="h-8 w-8 text-[hsl(var(--primary))] animate-spin" />
    </div>
  ) : activeConversation ? (
    <CardsChat conversation={activeConversation} />
  ) : conversations.length > 0 ? (
    <div className="flex flex-col h-full items-center justify-center text-center text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] rounded-lg shadow-sm dark:shadow-none p-4">
      <MessageSquare className="w-10 h-10 mb-2" />
      <p className="text-lg font-medium">Select a conversation</p>
      <p className="text-sm">Choose a conversation from the list to start chatting.</p>
    </div>
  ) : (
    <div className="flex flex-col h-full items-center justify-center text-center text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] rounded-lg shadow-sm dark:shadow-none p-4">
      <MessageSquare className="w-10 h-10 mb-2" />
      <p className="text-lg font-medium">No conversations found</p>
      <p className="text-sm">Start a new chat or wait for others to connect!</p>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-[hsl(var(--muted)_/_0.4)]">
      <SidebarMenu
        menuItemsTop={user.type === 'business' ? businessMenuItemsTop : chatsMenu}
        menuItemsBottom={user.type === 'business' ? businessMenuItemsBottom : menuItemsBottom}
        active="Chats"
      />
      <div className="flex flex-col flex-1 sm:pl-14 overflow-hidden">
        <Header
          menuItemsTop={user.type === 'business' ? businessMenuItemsTop : chatsMenu}
          menuItemsBottom={user.type === 'business' ? businessMenuItemsBottom : menuItemsBottom}
          activeMenu="Chats"
          breadcrumbItems={[
            { label: user.type === 'business' ? 'Business' : 'Freelancer', link: '/dashboard' },
            { label: 'Chats', link: '/chat' },
          ]}
          searchPlaceholder="Search chats..."
        />
        <main className="flex-1 overflow-hidden p-1 sm:p-2 md:p-4">
          <ChatLayout
            chatListComponent={chatListComponentContent}
            chatWindowComponent={chatWindowComponentContent}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
