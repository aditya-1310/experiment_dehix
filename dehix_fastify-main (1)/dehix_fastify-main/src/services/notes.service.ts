import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { NotesDao } from "../dao/note.dao";
import { INote } from "../models/notes.entity";

@Service()
export class NotesService extends BaseService {
  @Inject(NotesDao)
  private NotesDao!: NotesDao;

  async createNotes(notes: INote) {
    this.logger.info(
      `NotesService -> CreateNotes -> Creating a new note with data: ${JSON.stringify(notes)}`,
    );
    try {
      const note = await this.NotesDao.createNotes(notes, notes.userId);
      this.logger.info(
        `NotesService -> CreateNotes -> Note created successfully with ID: ${note._id}`,
      );
      return note;
    } catch (error: any) {
      this.logger.error(
        `NotesService -> CreateNotes -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async getNotes({ userId }: { userId: string }) {
    this.logger.info(
      `NotesService -> GetNotes -> Fetching notes for user ID: ${userId}`,
    );
    try {
      const notesData = await this.NotesDao.getNotes(userId);
      this.logger.info(
        `NotesService -> GetNotes -> Notes fetched successfully`,
      );
      return notesData;
    } catch (error: any) {
      this.logger.error(`NotesService -> GetNotes -> Error: ${error.message}`);
      throw error;
    }
  }

  async deleteNoteById(noteID: string) {
    this.logger.info(
      `NotesService -> DeleteNoteById -> Deleting note with ID: ${noteID}`,
    );
    try {
      const deleteNote = await this.NotesDao.deleteNoteById(noteID);
      if (deleteNote) {
        this.logger.info(
          `NotesService -> DeleteNoteById -> Note deleted successfully`,
        );
      } else {
        this.logger.info(
          `NotesService -> DeleteNoteById -> Note not found for ID: ${noteID}`,
        );
      }
      return deleteNote;
    } catch (error: any) {
      this.logger.error(
        `NotesService -> DeleteNoteById -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async updateNoteById(noteID: string, noteData: Partial<INote>) {
    this.logger.info(
      `NotesService -> UpdateNoteById -> Updating note with ID: ${noteID} and data: ${JSON.stringify(noteData)}`,
    );
    try {
      const updatedNote = await this.NotesDao.updateNoteById(
        noteID,
        noteData,
        noteData.userId,
      );
      this.logger.info(
        `NotesService -> UpdateNoteById -> Note updated successfully`,
      );
      return updatedNote;
    } catch (error: any) {
      this.logger.error(
        `NotesService -> UpdateNoteById -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async updateNoteOrder(userId: string, updatedOrder: string[]) {
    this.logger.info(
      `NotesService -> UpdateNoteOrder -> Updating note order for user ID: ${userId} with order: ${JSON.stringify(updatedOrder)}`,
    );
    try {
      const updated = await this.NotesDao.updateNoteOrder(userId, updatedOrder);
      this.logger.info(
        `NotesService -> UpdateNoteOrder -> Note order updated successfully`,
      );
      return updated;
    } catch (error: any) {
      this.logger.error(
        `NotesService -> UpdateNoteOrder -> Error: ${error.message}`,
      );
      throw error;
    }
  }
}
