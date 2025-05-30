import { firestoreClient } from "../common/services/firestore.service";
import { v4 as uuidv4 } from "uuid";

interface Conversation {
  participants: string[];
  project_name: string;
  type: "private" | "group";
}

/**
 * Adds a new conversation to the Firestore 'conversations' collection.
 * The timestamp is generated within the function.
 * @param conversationData - The conversation data to add.
 * @returns The unique ID of the added conversation.
 */
export async function addConversation(
  conversationData: Omit<Conversation, "type">,
): Promise<string> {
  try {
    // Generate a unique ID for the conversation
    const conversationId = uuidv4();

    const chatType =
      conversationData.participants.length === 2 ? "private" : "group";
    // Prepare the data to be stored with a dynamically generated timestamp
    const data = {
      id: conversationId,
      ...conversationData,
      type: chatType,
      timestamp: new Date().toISOString(),
    };

    // Use the Firestore client to add the data
    const addedConversationId = await firestoreClient.setData(
      "conversations",
      conversationId,
      data,
    );

    console.log(
      `Conversation (${chatType}) added successfully with ID: ${addedConversationId}`,
    );
    return addedConversationId;
  } catch (error: any) {
    console.error("Error adding conversation:", error);
    throw new Error(`Failed to add conversation: ${error.message}`);
  }
}
