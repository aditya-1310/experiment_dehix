/* eslint-disable prettier/prettier */
import { Service } from "fastify-decorators";
import AdminNoteModel, { IAdminNote } from "../models/adminnotes.model";
import { BaseDAO } from "../common/base.dao";
import { Model } from "mongoose";

@Service()
export class AdminNotesDoa extends BaseDAO {
  model: Model<IAdminNote>;
  constructor() {
    super();
    this.model = AdminNoteModel;
  }
  async createNotes(noteData: Partial<IAdminNote>) {
    return await this.model.create(noteData);
  }

  async findNoteById(noteId: string): Promise<IAdminNote | null> {
    return await this.model.findById(noteId);
  }

  async getAllNotes(): Promise<IAdminNote[]> {
    try {
      const notes = await this.model.find();
      if (notes.length === 0) {
        throw new Error("No notes found");
      }
      return notes;
    } catch (error: any) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  async updateNoteById(
    noteId: string,
    updateData: Partial<IAdminNote>,
  ): Promise<IAdminNote | null> {
    return await this.model.findByIdAndUpdate(noteId, updateData, {
      new: true,
    });
  }

  async deleteNoteById(noteId: string): Promise<IAdminNote | null> {
    return await this.model.findByIdAndDelete(noteId);
  }
}
