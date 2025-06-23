import { Service } from "fastify-decorators";
import VoiceMessageModel, { IVoiceMessage } from "../models/voiceMessage.model";
import { BaseDAO } from "../common/base.dao";
// import { Types } from "mongoose"; // No longer needed here

@Service()
export class VoiceMessageDAO extends BaseDAO {
  async createVoiceMessage(
    data: Partial<IVoiceMessage>,
  ): Promise<IVoiceMessage> {
    return this.create(VoiceMessageModel, data);
  }

  // findById is inherited from BaseDAO. Callers should use:
  // voiceMessageDAO.findById(VoiceMessageModel, id)
  // Or if a specific typed version is needed often, it should be:
  // async findVoiceMessageById(id: string | Types.ObjectId): Promise<IVoiceMessage | null> {
  //   return super.findById(VoiceMessageModel, id);
  // }
  // For now, removing the conflicting override.

  async findByConversationId(
    conversationId: string,
    limit: number = 50,
    sort: any = { timestamp: -1 },
  ): Promise<IVoiceMessage[]> {
    return this.findAll(VoiceMessageModel, { conversationId }, undefined, {
      limit,
      sort,
    });
  }

  // Add other specific methods if needed, for example:
  // async findBySenderId(senderId: string): Promise<IVoiceMessage[]> {
  //   return this.findAll(VoiceMessageModel, { senderId });
  // }
}
