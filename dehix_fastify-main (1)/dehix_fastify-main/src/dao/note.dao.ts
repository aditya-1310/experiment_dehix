import { Service } from "fastify-decorators";
import NoteModel, { INote } from "../models/notes.entity";
import NoteOrderModel, { INoteOrder } from "../models/noteOrder.entity";
import { BaseDAO } from "../common/base.dao";
import { Model } from "mongoose";
import { logger } from "../common/services";

@Service()
export class NotesDao extends BaseDAO {
  model: Model<INote>;
  noteOrderModel: Model<INoteOrder>;

  constructor() {
    super();
    this.model = NoteModel;
    this.noteOrderModel = NoteOrderModel;
  }

  // Create a new note and update the user's note order.

  async createNotes(noteData: Partial<INote>, userId: string): Promise<INote> {
    try {
      const newNote = await this.model.create(noteData);
      logger.info(`Note created successfully with ID: ${newNote._id}`);

      let noteOrderDoc = await this.noteOrderModel.findOne({ userId });

      if (!noteOrderDoc) {
        noteOrderDoc = await this.noteOrderModel.create({
          userId,
          noteOrder: { notes: [], archive: [], trash: [] },
        });
      }

      const targetArray =
        newNote.noteType === "ARCHIVE"
          ? noteOrderDoc.noteOrder.archive
          : noteOrderDoc.noteOrder.notes;

      targetArray.push(newNote._id);
      await noteOrderDoc.save();

      return newNote;
    } catch (error: any) {
      logger.error(`Error creating note: ${error.message}`);
      throw new Error("Error creating note and updating note order.");
    }
  }

  // Find a note by its ID.

  async findNoteById(noteId: string): Promise<INote | null> {
    try {
      return await this.model.findById(noteId).lean();
    } catch (error: any) {
      logger.error(`Error finding note: ${error.message}`);
      throw new Error("Error finding note by ID.");
    }
  }

  // Update a note by its ID.

  async updateNoteById(
    noteId: string,
    updateData: Partial<INote>,
    userId: string | undefined,
  ): Promise<INote | null> {
    try {
      logger.info(
        `Updating note with ID: ${userId} and data: ${JSON.stringify(updateData)}`,
      );
      // Fetch the existing note
      const existingNote = await this.model.findById(noteId).lean();
      if (!existingNote) {
        throw new Error("Note not found.");
      }

      // Update the note
      const updatedNote = await this.model
        .findByIdAndUpdate(noteId, updateData, { new: true })
        .lean();
      if (!updatedNote) {
        throw new Error("Failed to update the note.");
      }

      // Check if the `noteType` has changed
      if (
        updateData.noteType &&
        updateData.noteType !== existingNote.noteType
      ) {
        const noteOrderDoc = await this.noteOrderModel.findOne({ userId });

        if (!noteOrderDoc) {
          throw new Error("Note order document not found for this user.");
        }

        // Pull the note ID from the current array
        const { noteOrder } = noteOrderDoc;
        if (existingNote.noteType === "NOTE") {
          noteOrder.notes = noteOrder.notes.filter(
            (id: string) => id !== noteId,
          );
        } else if (existingNote.noteType === "ARCHIVE") {
          noteOrder.archive = noteOrder.archive.filter(
            (id: string) => id !== noteId,
          );
        } else if (existingNote.noteType === "TRASH") {
          noteOrder.trash = noteOrder.trash.filter(
            (id: string) => id !== noteId,
          );
        }

        // Push the note ID into the new array
        if (updateData.noteType === "NOTE") {
          noteOrder.notes.push(noteId);
        } else if (updateData.noteType === "ARCHIVE") {
          noteOrder.archive.push(noteId);
        } else if (updateData.noteType === "TRASH") {
          noteOrder.trash.push(noteId);
        }
        logger.info(`Note type updated to: ${noteOrderDoc}`);
        // Save the updated note order
        await noteOrderDoc.save();
      }

      return updatedNote;
    } catch (error: any) {
      logger.error(`Error updating note: ${error.message}`);
      throw new Error("Error updating note by ID.");
    }
  }

  // Delete a note by its ID.

  async deleteNoteById(noteId: string): Promise<INote | null> {
    try {
      return await this.model.findByIdAndDelete(noteId);
    } catch (error: any) {
      logger.error(`Error deleting note: ${error.message}`);
      throw new Error("Error deleting note by ID.");
    }
  }

  // Get notes, archive, and trash for a user in sorted order.

  async getNotes(userId: string): Promise<{
    notes: INote[];
    archive: INote[];
    trash: INote[];
  }> {
    try {
      if (!userId) throw new Error("UserId is required to fetch notes.");

      const noteOrderDoc = await this.noteOrderModel.findOne({ userId }).lean();
      if (!noteOrderDoc) throw new Error("No note order found for this user.");

      const [notes, archive, trash] = await Promise.all([
        this.model.find({ userId, noteType: "NOTE" }).lean(),
        this.model.find({ userId, noteType: "ARCHIVE" }).lean(),
        this.model.find({ userId, noteType: "TRASH" }).lean(),
      ]);

      const sortedNotes = this.sortNotes(noteOrderDoc.noteOrder.notes, notes);
      const sortedArchive = this.sortNotes(
        noteOrderDoc.noteOrder.archive,
        archive,
      );
      const sortedTrash = this.sortNotes(noteOrderDoc.noteOrder.trash, trash);

      return { notes: sortedNotes, archive: sortedArchive, trash: sortedTrash };
    } catch (error: any) {
      logger.error(`Error fetching notes: ${error.message}`);
      throw new Error("Error fetching notes.");
    }
  }

  //  Update the order of notes for a user.

  async updateNoteOrder(userId: string, updatedOrder: string[]): Promise<void> {
    try {
      if (!userId || !Array.isArray(updatedOrder)) {
        throw new Error(
          "Invalid input: userId and updated order are required.",
        );
      }

      const noteOrderDoc = await this.noteOrderModel.findOne({ userId });
      if (!noteOrderDoc) throw new Error("No note order found for this user.");

      noteOrderDoc.noteOrder.notes = updatedOrder;
      await noteOrderDoc.save();
    } catch (error: any) {
      logger.error(`Error updating note order: ${error.message}`);
      throw new Error("Error updating note order.");
    }
  }

  //  Helper function to sort notes based on a given order.

  private sortNotes(order: string[], notes: INote[]): INote[] {
    return order
      .map((noteId) => notes.find((note) => note._id.toString() === noteId))
      .filter((note): note is INote => !!note);
  }
}
