// import { firestoreClient } from "../common/services/firestore.service";
import { v4 as uuidv4 } from "uuid";

interface Conversation {
  participants: string[];
  project_name: string;
  type: "private" | "group";
}

/**
 * Adds a new conversation. (Firestore logic removed)
 * Generates and returns a unique ID.
 */
export async function addConversation(
  conversationData: Omit<Conversation, "type">,
): Promise<string> {
  try {
    const conversationId = uuidv4();
    const chatType =
      conversationData.participants.length === 2 ? "private" : "group";

    const data = {
      id: conversationId,
      ...conversationData,
      type: chatType,
      timestamp: new Date().toISOString(),
    };

    // TODO: Save 'data' to MongoDB or another storage

    console.log(
      `Conversation (${chatType}) added successfully with ID: ${conversationId}`,
    );
    return conversationId;
  } catch (error: any) {
    console.error("Error adding conversation:", error);
    throw new Error(`Failed to add conversation: ${error.message}`);
  }
}
