//chat.tsx
import * as React from 'react';
import {
  Send,
  LoaderCircle,
  Video,
  Upload,
  Maximize2,
  Search,
  MoreVertical,
  Minimize2,
  Reply,
  Text,
  X,
  Bold,
  Italic,
  Underline,
  CheckCheck,
  Flag, // Added
  HelpCircle,
  Mic, // Added for voice recording
  StopCircle, // Added for stopping recording
  PlayCircle, // Added for playing preview
  PauseCircle, // Added for pausing preview
  Trash2, // Added for discarding recording
  Paperclip, // Existing, or could be Upload if that's preferred for general attachments
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { DocumentData } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Added
import ReactMarkdown from 'react-markdown'; // Import react-markdown to render markdown
import remarkGfm from 'remark-gfm';
import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  isThisYear,
} from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify'; // <-- add import later

import { EmojiPicker } from '../emojiPicker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added

import { Conversation } from './chatList'; // Assuming Conversation type includes 'type' field
import Reactions from './reactions';
import { FileAttachment } from './fileAttachment';
// ProfileSidebar is no longer imported or rendered here

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  subscribeToFirestoreCollection,
  updateConversationWithMessageTransaction,
  updateDataInFirestore,
} from '@/utils/common/firestoreUtils';
import { axiosInstance } from '@/lib/axiosinstance';
import { RootState } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

function formatChatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'hh:mm a'); // Example: "10:30 AM"
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'hh:mm a')}`; // Example: "Yesterday, 10:30 AM"
  }

  if (isThisYear(date)) {
    return format(date, 'MMM dd, hh:mm a'); // Example: "Oct 12, 10:30 AM"
  }

  return format(date, 'yyyy MMM dd, hh:mm a'); // Example: "2023 Oct 12, 10:30 AM"
}

type User = {
  userName: string;
  email: string;
  profilePic: string;
};

type MessageReaction = Record<string, string[]> | undefined;

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  replyTo?: string | null;
  reactions?: MessageReaction;
};

interface CardsChatProps {
  conversation: Conversation;
  conversations?: any;
  setActiveConversation?: any;
  isChatExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenProfileSidebar?: (id: string, type: 'user' | 'group', initialDetails?: { userName?: string; email?: string; profilePic?: string }) => void;
}

export function CardsChat({
  conversation,
  conversations,
  setActiveConversation,
  isChatExpanded,
  onToggleExpand,
  onOpenProfileSidebar,
}: CardsChatProps) {
  const router = useRouter();
  const [primaryUser, setPrimaryUser] = useState<User>({
    userName: '',
    email: '',
    profilePic: '',
  });

  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const inputLength = input.trim().length;
  const user = useSelector((state: RootState) => state.user);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [replyToMessageId, setReplyToMessageId] = useState<string>('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [showFormattingOptions, setShowFormattingOptions] =
    useState<boolean>(false);

  const prevMessagesLength = useRef(messages.length);
  const [openDrawer, setOpenDrawer] = useState(false);

  // States for voice recording
  type RecordingStatus = "idle" | "permission_pending" | "recording" | "recorded" | "uploading";
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // For preview
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0); // In seconds
  const recordingDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);


  const handleHeaderClick = () => {
    if (!onOpenProfileSidebar) return;

    if (conversation.type === 'group') {
      onOpenProfileSidebar(conversation.id, 'group', {
        userName: conversation.displayName,
        profilePic: conversation.avatar,
      });
    } else {
      const otherParticipantUid = conversation.participants.find(p => p !== user.uid);
      if (otherParticipantUid) {
        const participantDetails = conversation.participantDetails?.[otherParticipantUid];
        const initialUserData = {
            userName: participantDetails?.userName || primaryUser.userName,
            email: participantDetails?.email || primaryUser.email,
            profilePic: participantDetails?.profilePic || primaryUser.profilePic,
        };
        onOpenProfileSidebar(otherParticipantUid, 'user', initialUserData);
      } else {
        console.error("Could not determine the other participant in an individual chat for profile sidebar.");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenDrawer(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPrimaryUserAndMessages = async () => {
      const primaryUid = conversation.participants.find(
        (participant: string) => participant !== user.uid,
      );

      let userDetailsFoundInConversation = false;
      if (primaryUid && conversation.participantDetails && conversation.participantDetails[primaryUid] && conversation.participantDetails[primaryUid].userName) {
        const details = conversation.participantDetails[primaryUid];
        setPrimaryUser({
          userName: details.userName,
          email: details.email || '', 
          profilePic: details.profilePic || '', 
        });
        userDetailsFoundInConversation = true;
      }

      if (primaryUid && !userDetailsFoundInConversation) {
        try {
          const response = await axiosInstance.get(`/freelancer/${primaryUid}`);
          setPrimaryUser(response.data.data);
        } catch (error) {
          console.error('Error fetching primary user via API:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load user details. Please try again.',
          });
        }
      }
    };

    let unsubscribeMessages: (() => void) | undefined;
    const fetchMessages = async () => {
      setLoading(true);
      unsubscribeMessages = subscribeToFirestoreCollection(
        `conversations/${conversation.id}/messages`,
        (messagesData) => {
          setMessages(messagesData);
          setLoading(false);
        },
        'desc',
      );
    };

    if (conversation) {
      fetchPrimaryUserAndMessages();
      unsubscribeMessages = subscribeToFirestoreCollection(
        `conversations/${conversation.id}/messages`,
        (messagesData) => {
          setMessages(messagesData);
          setLoading(false);
        },
        'desc',
      );
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
      // Cleanup for voice recording
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      if (recordingDurationIntervalRef.current) {
        clearInterval(recordingDurationIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl); // Clean up preview URL
      }
    };
  }, [conversation, user.uid, mediaRecorder, audioUrl]); // Added mediaRecorder and audioUrl to dependency array

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  async function sendMessage(
    conversation: Conversation,
    message: Partial<Message>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
  ) {
    try {
      setIsSending(true);
      const datentime = new Date().toISOString();

      const messageId = await updateConversationWithMessageTransaction(
        'conversations',
        conversation?.id,
        {
          ...message,
          timestamp: datentime,
          replyTo: replyToMessageId || null,
        },
        datentime,
      );

      if (messageId) {
        setInput('');
        setIsSending(false);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }

  if (!conversation) {
    return null;
  }

  async function handleFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.ppt,.pptx';

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'File size should not exceed 10MB',
        });
        return;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please upload an image, PDF, Word, or PowerPoint file',
        });
        return;
      }

      try {
        setIsSending(true);
        const formData = new FormData();
        formData.append('file', file);

        console.log('Starting file upload:', {
          name: file.name,
          type: file.type,
          size: file.size,
          timestamp: new Date().toISOString()
        });

        // Function to attempt upload with retries
        const attemptUpload = async (retryCount = 0, maxRetries = 3) => {
          try {
            const postFileResponse = await axiosInstance.post(
              '/register/upload-image',
              formData,
              {
                headers: { 
                  'Content-Type': 'multipart/form-data',
                  'Accept': 'application/json'
                },
                onUploadProgress: (progressEvent) => {
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                  console.log('Upload progress:', {
                    percent: percentCompleted,
                    loaded: progressEvent.loaded,
                    total: progressEvent.total,
                    timestamp: new Date().toISOString()
                  });
                },
              },
            );

            return postFileResponse;
          } catch (error: any) {
            if (retryCount < maxRetries && (error.code === 'ERR_CANCELED' || error.code === 'ECONNABORTED')) {
              console.log(`Retrying upload (attempt ${retryCount + 1} of ${maxRetries})`);
              // Wait for 1 second before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
              return attemptUpload(retryCount + 1, maxRetries);
            }
            throw error;
          }
        };

        const postFileResponse = await attemptUpload();
        console.log('Upload response:', {
          data: postFileResponse.data,
          timestamp: new Date().toISOString()
        });

        const fileUrl = postFileResponse.data.data.Location;

        const message: Partial<Message> = {
          senderId: user.uid,
          content: fileUrl,
          timestamp: new Date().toISOString(),
        };

        await sendMessage(conversation, message, setInput);
        
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
        });
      } catch (error: any) {
        console.error('Error uploading file:', {
          error: error.message,
          code: error.code,
          response: error.response?.data,
          timestamp: new Date().toISOString()
        });
        
        let errorMessage = 'Failed to upload file. Please try again.';
        if (error.code === 'ERR_CANCELED') {
          errorMessage = 'Upload was canceled. Please try again.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Connection was aborted. Please check your network connection and try again.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: errorMessage,
        });
      } finally {
        setIsSending(false);
      }
    };

    fileInput.click();
  }

  async function handleCreateMeet() {
    try {
      const response = await axiosInstance.post('/meeting', {
        participants: conversation.participants,
      });

      const meetLink = response.data.meetLink;
      const message: Partial<Message> = {
        senderId: user.uid,
        content: `🔗 Join the Meet: [Click here](${meetLink})`,
        timestamp: new Date().toISOString(),
      };

      sendMessage(conversation, message, setInput);
    } catch (error) {
      console.error('Error creating meet:', error);
    }
  }

  /**
   * Apply bold using execCommand so the formatting appears live.
   */
  function handleBold() {
    composerRef.current?.focus();
    document.execCommand('bold');
  }
  
  /**
   * Underline uses <u> tags (markdown has no underline). Same logic as bold.
   */
  const handleUnderline = () => {
    composerRef.current?.focus();
    document.execCommand('underline');
  };

  /**
   * Italic formatting with single * markers.
   */
  function handleitalics() {
    composerRef.current?.focus();
    document.execCommand('italic');
  }

  const toggleFormattingOptions = () => {
    setShowFormattingOptions((prev) => !prev);
  };

  // Voice Recording Functions
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startRecording = async () => {
    if (recordingStatus === "recording") return;
    setRecordingStatus("permission_pending");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop()); // Stop mic access
        setRecordingStatus("recorded");
        if (recordingDurationIntervalRef.current) {
          clearInterval(recordingDurationIntervalRef.current);
        }
      };

      recorder.start();
      setAudioChunks([]); // Clear previous chunks
      setAudioBlob(null); // Clear previous blob
      setAudioUrl(null); // Clear previous URL
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
      recordingDurationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setRecordingStatus("recording");
      toast({ title: "Recording started", description: "Speak into your microphone."});

    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({ variant: "destructive", title: "Microphone Error", description: "Could not access microphone. Please check permissions." });
      setRecordingStatus("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recordingStatus === "recording") {
      mediaRecorder.stop();
      // The onstop event handler will set status to "recorded" and clear interval
      // Create blob and URL after chunks are all collected in onstop, or here if preferred.
      // For simplicity, let's assume onstop handles setting the final audioBlob and audioUrl
    }
    // Ensure interval is cleared if stopRecording is called unexpectedly
    if (recordingDurationIntervalRef.current) {
      clearInterval(recordingDurationIntervalRef.current);
    }
  };

  useEffect(() => {
    // This effect runs when audioChunks changes, specifically after recording stops and all chunks are in.
    if (recordingStatus === "recorded" && audioChunks.length > 0) {
      const blob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioChunks([]); // Clear chunks after creating blob
    }
  }, [audioChunks, recordingStatus, mediaRecorder?.mimeType]);


  const discardRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioChunks([]);
    setAudioBlob(null);
    setAudioUrl(null);
    setMediaRecorder(null);
    setRecordingStatus("idle");
    setRecordingDuration(0);
    if (recordingDurationIntervalRef.current) {
      clearInterval(recordingDurationIntervalRef.current);
    }
    toast({ title: "Recording discarded"});
  };

  const handleSendVoiceMessage = async () => {
    if (!audioBlob || !user || !conversation) {
      toast({ variant: "destructive", title: "Error", description: "No audio recorded or user/conversation not found." });
      return;
    }

    setRecordingStatus("uploading");
    const formData = new FormData();
    // Ensure we send a proper File object rather than just a Blob
    const audioFile = new File([audioBlob], `voice-message.${audioBlob.type.split('/')[1] || 'webm'}`, { type: audioBlob.type });
    formData.append('file', audioFile);
    formData.append('senderId', user.uid);
    // For individual chats, receiverId is the other participant. For group chats, it's the conversation ID.
    const receiverId = conversation.type === 'group'
      ? conversation.id
      : conversation.participants.find(p => p !== user.uid) || conversation.id;
    formData.append('receiverId', receiverId);
    formData.append('conversationId', conversation.id);
    // Send duration as JSON stringified object with value property
    formData.append('duration', JSON.stringify({ value: recordingDuration }));

    // Debug logging
    console.log('Voice message upload - FormData contents:');
    console.log('File:', audioFile, 'Type:', audioFile.type, 'Size:', audioFile.size);
    console.log('SenderId:', user.uid);
    console.log('ReceiverId:', receiverId);
    console.log('ConversationId:', conversation.id);
    console.log('Duration:', JSON.stringify({ value: recordingDuration }));

    try {
      // Using axiosInstance from the project
      const response = await axiosInstance.post('/v1/voice-messages/upload', formData, {
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.status === 201) {
        toast({ title: "Success", description: "Voice message sent!" });
        // Message should appear via Firestore listener.
        // If not, one might need to manually add it or trigger a refetch.
      } else {
        throw new Error(response.data.error || "Failed to upload voice message");
      }
    } catch (error: any) {
      console.error("Error sending voice message:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: error.message || "Could not send voice message." });
    } finally {
      discardRecording(); // Clean up states regardless of success/failure
      setRecordingStatus("idle");
    }
  };

  async function toggleReaction(messageId: string, emoji: string): Promise<void> {
    const currentMessage = messages.find((msg) => msg.id === messageId);
    const updatedReactions: Record<string, string[]> = currentMessage?.reactions ? { ...currentMessage.reactions } : {};

    const userReaction = Object.keys(updatedReactions).find((existingEmoji) =>
      updatedReactions[existingEmoji]?.includes(user.uid),
    );

    if (userReaction === emoji) {
      updatedReactions[emoji] = updatedReactions[emoji].filter(
        (uid: string) => uid !== user.uid,
      );

      if (updatedReactions[emoji].length === 0) {
        delete updatedReactions[emoji];
      }
    } else {
      if (userReaction) {
        updatedReactions[userReaction] = updatedReactions[userReaction].filter(
          (uid: string) => uid !== user.uid,
        );
        if (updatedReactions[userReaction].length === 0) {
          delete updatedReactions[userReaction];
        }
      }

      if (!updatedReactions[emoji]) {
        updatedReactions[emoji] = [];
      }
      updatedReactions[emoji].push(user.uid);
    }

    await updateDataInFirestore(
      `conversations/${conversation.id}/messages/`,
      messageId,
      {
        reactions: updatedReactions,
      },
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center p-5 col-span-3">
          <LoaderCircle className="h-6 w-6 text-white animate-spin" />
        </div>
      ) : (
        <>
          <Card className="col-span-3 flex flex-col h-full bg-[hsl(var(--card))] shadow-xl dark:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-3 border-b border-[hsl(var(--border))] shadow-md dark:shadow-sm">
              <button
                onClick={handleHeaderClick}
                className="flex items-center space-x-3 text-left hover:bg-[#e4e7ecd1] dark:hover:bg-[hsl(var(--accent)_/_0.5)] p-1 rounded-md transition-colors"
                aria-label="View profile information"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation.type === 'group' ? (conversation.participantDetails && conversation.participantDetails[conversation.id]?.profilePic) || `https://api.adorable.io/avatars/285/group-${conversation.id}.png` : primaryUser.profilePic} alt={conversation.type === 'group' ? conversation.groupName : primaryUser.userName || 'User'} />
                  <AvatarFallback className="bg-[#d7dae0] dark:bg-[#35383b9e] text-[hsl(var(--foreground))]">
                    {(conversation.type === 'group' ? conversation.groupName : primaryUser.userName) ? (conversation.type === 'group' ? conversation.groupName?.charAt(0).toUpperCase() : primaryUser.userName?.charAt(0).toUpperCase()) : 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold leading-none text-[hsl(var(--card-foreground))]">
                    {conversation.type === 'group' ? conversation.groupName : primaryUser.userName || 'Chat'}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {conversation.type === 'group' ? `${conversation.participants.length} members` : primaryUser.email || 'Click to view profile'}
                  </p>
                </div>
              </button>
              <div className="flex items-center space-x-0.5 sm:space-x-1">
              <Button variant="ghost" size="icon" aria-label="Search in chat" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Video call" onClick={handleCreateMeet} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={isChatExpanded ? "Collapse chat" : "Expand chat"}
                onClick={() => {
                  console.log("[CardsChat] Expand/collapse button clicked!");
                  if (onToggleExpand) {
                    onToggleExpand();
                  } else {
                    console.error("[CardsChat] onToggleExpand is undefined!");
                  }
                }}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                {isChatExpanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="More options" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5} className="w-48 bg-[#d7dae0] dark:bg-[hsl(var(--popover))]">
                  <DropdownMenuItem className="text-black dark:text-[hsl(var(--popover-foreground))] hover:!bg-transparent focus:!bg-transparent cursor-pointer">
                    <Flag className="mr-2 h-4 w-4" />
                    <span>Report</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-black dark:text-[hsl(var(--popover-foreground))] hover:!bg-transparent focus:!bg-transparent  cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--background))]">
            <div className="flex flex-col-reverse space-y-3 space-y-reverse">
              <div ref={messagesEndRef} />
              {messages.map((message, index) => {
                const formattedTimestamp = formatChatTimestamp(message.timestamp);
                const readableTimestamp = formatDistanceToNow(new Date(message.timestamp)) + ' ago';
                const isSender = message.senderId === user.uid;

                return (
                  <div
                    id={message.id}
                    key={index}
                    className={cn(
                      "flex flex-row items-start relative group",
                      isSender ? "justify-end" : "justify-start"
                    )}
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    {!isSender && (
                      <Avatar key={index} className="w-8 h-8 mr-2 mt-0.5 flex-shrink-0">
                        <AvatarImage src={primaryUser.profilePic} alt={message.senderId} />
                        <AvatarFallback className="bg-sw-gradient dark:bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]">
                          {primaryUser.userName ? primaryUser.userName.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                        
                        
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'flex w-max max-w-[70%] md:max-w-[60%] flex-col gap-1 rounded-2xl px-4 py-3 text-sm shadow-sm',
                        isSender
                          ? 'ml-auto bg-[#c8a3ed] text-[hsl(var(--foreground))] dark:bg-[#9966ccba] dark:text-gray-50 rounded-br-none'
                          : 'bg-[#c8a3ed] text-[hsl(var(--foreground))] dark:bg-[#9966ccba] dark:text-[hsl(var(--secondary-foreground))] rounded-bl-none',
                      )}
                      onClick={() => {
                        if (message.replyTo) {
                          const replyMessageElement = document.getElementById(message.replyTo);
                          if (replyMessageElement) {
                              replyMessageElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'dark:ring-offset-gray-800', 'transition-all', 'duration-300');
                            replyMessageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setTimeout(() => {
                                replyMessageElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'dark:ring-offset-gray-800');
                            }, 2500);
                          }
                        }
                      }}
                    >
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="break-words w-full">
                              {message.replyTo && (
                                <div className="p-1.5 bg-primary/10 dark:bg-primary/40 rounded-md border-l-2 border-primary/60 dark:border-primary/70 mb-1.5 text-xs">
                                  <div className={cn("italic overflow-hidden whitespace-pre-wrap text-ellipsis max-h-[3em] line-clamp-2", isSender ? "text-primary-foreground dark:text-primary-foreground" : "text-primary dark:text-primary")}>
                                    <span className="font-medium">
                                      {messages.find(msg => msg.id === message.replyTo)?.content.substring(0,100) || 'Original message'}
                                      { (messages.find(msg => msg.id === message.replyTo)?.content?.length || 0) > 100 && "..."}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {message.content.match(/\.(jpeg|jpg|gif|png)(\?|$)/i) ? (
                                <Image src={message.content || '/placeholder.svg'} alt="Message Image" width={300} height={300} className="rounded-md my-1" />
                              ) : message.content.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i) ? (
                                <FileAttachment fileName={message.content.split('/').pop() || 'File'} fileUrl={message.content} fileType={message.content.split('.').pop() || 'file'} />
                              ) : (
                                <ReactMarkdown
                                  className={cn(
                                    "prose prose-sm dark:prose-invert max-w-none",
                                    isSender
                                      ? "text-[hsl(var(--foreground))] dark:text-gray-50"
                                      : "text-[hsl(var(--foreground))] dark:text-[hsl(var(--secondary-foreground))]",
                                  )}
                                  remarkPlugins={[remarkGfm]}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              )}
                              {/* Voice Message Player */}
                              {message.audioUrl && message.duration !== undefined && (
                                <div className="mt-2">
                                  <audio src={message.audioUrl} controls className="w-full h-10 rounded-md" />
                                  <p className="text-xs text-right mt-1 text-[hsl(var(--muted-foreground))]">
                                    Duration: {formatDuration(message.duration)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" sideOffset={5} className="bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))] text-xs p-1 rounded">
                            <p>{readableTimestamp}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Reactions messageId={message.id} reactions={message.reactions || {}} toggleReaction={toggleReaction} />
                      <div className={cn("flex items-center text-xs mt-1",
                        isSender
                          ? 'text-[hsl(var(--foreground)_/_0.8)] dark:text-purple-300'
                          : 'text-[hsl(var(--foreground)_/_0.8)] dark:text-[hsl(var(--muted-foreground))]',
                        isSender ? "justify-end" : "justify-start")}>
                        {formattedTimestamp}
                        {isSender && (
                          <span className="ml-1"><CheckCheck className="w-3.5 h-3.5" /></span>
                        )}
                      </div>
                    </div>
                    <div className={cn("relative opacity-0 group-hover:opacity-100 transition-opacity", isSender ? 'mr-1' : 'ml-1')}>
                      {!isSender && (
                         <EmojiPicker aria-label="Add reaction" onSelect={(emoji: string) => toggleReaction(message.id, emoji)} />
                      )}
                      <Button variant="ghost" size="icon"
                        className={cn("h-7 w-7 hover:bg-primary-hover/10 dark:hover:bg-primary-hover/20",
                          isSender ? "text-[hsl(var(--foreground)_/_0.8)] dark:text-purple-300" : "text-[hsl(var(--muted-foreground))]"
                        )}
                        onClick={() => setReplyToMessageId(message.id)} aria-label="Reply to message">
                         <Reply className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="bg-[hsl(var(--card))] p-2 border-t border-[hsl(var(--border))] shadow-md dark:shadow-sm">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (input.trim().length === 0) return;
                const newMessage = { senderId: user.uid, content: input, timestamp: new Date().toISOString(), replyTo: replyToMessageId || null };
                sendMessage(conversation, newMessage, setInput);
                setReplyToMessageId('');
              }}
              className="flex flex-col w-full space-y-2"
              aria-label="Message input form"
            >
              {replyToMessageId && (
                <div className="flex items-center justify-between p-2 rounded-md bg-[hsl(var(--accent))] border-l-2 border-[hsl(var(--primary))_/_0.7]">
                  <div className="text-xs italic text-[hsl(var(--muted-foreground))] overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                    Replying to: <span className="font-semibold">{messages.find((msg) => msg.id === replyToMessageId)?.content.replace(/\*|__/g, '').substring(0,50) || 'Message'}...</span>
                  </div>
                  <Button onClick={() => setReplyToMessageId('')} variant="ghost" size="icon" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] h-6 w-6 rounded-full" aria-label="Cancel reply">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div
                  ref={composerRef}
                  contentEditable
                  aria-label="Type a message"
                  aria-placeholder="Type a message..."
                  data-placeholder="Type a message..."
                  className="flex-1 min-h-[36px] max-h-60 overflow-y-auto border border-[hsl(var(--input))] rounded-lg p-2.5 bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))] empty:before:content-[attr(data-placeholder)] empty:before:text-[hsl(var(--muted-foreground))]"
                  onInput={(e) => {
                    const html = (e.currentTarget as HTMLElement).innerHTML;
                    setInput(html);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                      e.preventDefault();
                      const html = composerRef.current?.innerHTML || '';
                      const textContent = composerRef.current?.innerText || '';
                      if (textContent.trim().length > 0) {
                        const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b','strong','i','em','u','br','div','span','a'] });
                        const newMessage = { senderId: user.uid, content: sanitized, timestamp: new Date().toISOString(), replyTo: replyToMessageId || null };
                        sendMessage(conversation, newMessage, setInput);
                        setReplyToMessageId('');
                        composerRef.current!.innerHTML = '';
                        setInput('');
                      }
                    }
                  }}
                  suppressContentEditableWarning
                />
                <Button type="button" size="icon" variant="ghost" className="rounded-full bg-[#96c] hover:bg-[#96c]/90 text-white disabled:bg-[#96c]/50" disabled={!input.trim().length || isSending} aria-label="Send message"
                  onClick={() => {
                    const html = composerRef.current?.innerHTML || '';
                    const textContent = composerRef.current?.innerText || '';
                    if (textContent.trim().length === 0) return;
                    const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b','strong','i','em','u','br','div','span','a'] });
                    const newMessage = { senderId: user.uid, content: sanitized, timestamp: new Date().toISOString(), replyTo: replyToMessageId || null };
                    sendMessage(conversation, newMessage, setInput);
                    setReplyToMessageId('');
                    composerRef.current!.innerHTML = '';
                    setInput('');
                  }}
                 >
                  {isSending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                 <Button type="button" variant="ghost" size="icon" onClick={handleBold} title="Bold" aria-label="Bold" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] md:hidden"> <Bold className="h-4 w-4" /> </Button>
                 <Button type="button" variant="ghost" size="icon" onClick={handleitalics} title="Italic" aria-label="Italic" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] md:hidden"> <Italic className="h-4 w-4" /> </Button>
                 <Button type="button" variant="ghost" size="icon" onClick={handleUnderline} title="Underline" aria-label="Underline" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] md:hidden"> <Underline className="h-4 w-4" /> </Button>

                 <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" onClick={toggleFormattingOptions} title="Formatting options" aria-label="Formatting options" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hidden md:inline-flex"> <Text className="h-4 w-4" /> </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Formatting</p></TooltipContent>
                    </Tooltip>
                 </TooltipProvider>

                {showFormattingOptions && (
                    <div className="hidden md:flex items-center space-x-1 bg-[#d7dae0] dark:bg-[hsl(var(--accent))] p-1 rounded-md">
                      <Button type="button" variant="ghost" size="icon" onClick={handleBold} title="Bold" aria-label="Bold" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"> <Bold className="h-4 w-4" /> </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={handleitalics} title="Italic" aria-label="Italic" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"> <Italic className="h-4 w-4" /> </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={handleUnderline} title="Underline" aria-label="Underline" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"> <Underline className="h-4 w-4" /> </Button>
                    </div>
                )}
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button type="button" variant="ghost" size="icon" onClick={handleFileUpload} title="Upload file" aria-label="Upload file" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"> <Upload className="h-4 w-4" /> </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Upload file</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button type="button" variant="ghost" size="icon" onClick={handleCreateMeet} title="Create Google Meet" aria-label="Create Google Meet" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"> <Video className="h-4 w-4" /> </Button>
                        </TooltipTrigger>
                         <TooltipContent side="top"><p>Create Google Meet</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {recordingStatus === "idle" && (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" onClick={startRecording} title="Record voice message" aria-label="Record voice message" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                          <Mic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Record voice</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                 <div className="ml-auto md:hidden">
                 </div>
              </div>

              {/* Voice Recording UI */}
              {recordingStatus !== "idle" && recordingStatus !== "uploading" && ( // Hide this part during uploading too
                <div className="p-2 border-t border-[hsl(var(--border))]">
                  {recordingStatus === "permission_pending" && (
                    <div className="flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
                      <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                      Requesting microphone permission...
                    </div>
                  )}
                  {recordingStatus === "recording" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-red-500">
                        <Mic className="w-4 h-4 mr-2 animate-pulse" />
                        Recording... {formatDuration(recordingDuration)}
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={stopRecording} title="Stop recording" className="text-red-500 hover:text-red-700">
                        <StopCircle className="h-6 w-6" />
                      </Button>
                    </div>
                  )}
                  {recordingStatus === "recorded" && audioUrl && (
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm font-medium">Recording complete ({formatDuration(recordingDuration)})</div>
                      <audio ref={audioPreviewRef} src={audioUrl} controls className="w-full h-10" />
                      <div className="flex items-center justify-end space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={discardRecording} title="Discard recording">
                          <Trash2 className="h-4 w-4 mr-1" /> Discard
                        </Button>
                        <Button type="button" variant="default" size="sm" onClick={handleSendVoiceMessage} title="Send voice message">
                          <Send className="h-4 w-4 mr-1" /> Send
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Uploading indicator was here, moved below */}
                </div>
              )}
              {/* Separate block for uploading indicator to ensure it's visible */}
              {recordingStatus === "uploading" && (
                <div className="p-2 flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))]">
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Uploading voice message...
                </div>
              )}
            </form>
          </CardFooter>
        </Card>
      </>
      )}
    </>
  );
}
