/* eslint-disable prettier/prettier */
import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { AdminNotesDoa } from "../dao/adminnotes.dao";
import { AdminDAO } from "./../dao/admin.dao";
import { NotFoundError, UnAuthorisedError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { IAdminNote } from "./../models/adminnotes.model";

@Service()
export class AdminNotesService extends BaseService {
  @Inject(AdminNotesDoa)
  private AdminNotesDoa!: AdminNotesDoa;

  @Inject(AdminDAO)
  private AdminDao!: AdminDAO;

  async getAllNotes() {
    try {
      const notes: any = await this.AdminNotesDoa.getAllNotes();
      return notes;
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  async createAdminNotes(notes: IAdminNote) {
    try {
      const note = await this.AdminNotesDoa.createNotes(notes);
      return note;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteAdminNoteById(noteID: string) {
    this.logger.info(
      `NotesService -> DeleteNoteById -> Deleting note by id ${noteID}`,
    );

    const checkNote = await this.AdminNotesDoa.findNoteById(noteID);
    if (!checkNote) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    //find type of the admin from adminId if type is 'ADMIN' then can delete note only if userId = adminId, if type is 'SUPERADMIN then can delete any note
    const admin = await this.AdminDao.findAdminById(checkNote.adminId);
    if (!admin) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    if (
      admin.type == "SUPER_ADMIN" ||
      (admin.type == "ADMIN" && checkNote.userId == checkNote.adminId)
    ) {
      const deleteNote = await this.AdminNotesDoa.deleteNoteById(noteID);
      return deleteNote;
    } else {
      throw new UnAuthorisedError(
        RESPONSE_MESSAGE.UNAUTHORISED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }
  }

  async updateAdminNoteById(noteID: string, noteData: Partial<IAdminNote>) {
    this.logger.info(
      `NotesService -> UpdateNoteById -> Updating note by id ${noteID}`,
    );

    const checkNote = await this.AdminNotesDoa.findNoteById(noteID);
    if (!checkNote) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const admin = await this.AdminDao.findAdminById(checkNote.adminId);
    if (!admin) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    if (
      admin.type == "SUPER_ADMIN" ||
      (admin.type == "ADMIN" && checkNote.userId == checkNote.adminId)
    ) {
      const updateNote = await this.AdminNotesDoa.updateNoteById(
        noteID,
        noteData,
      );
      return updateNote;
    } else {
      throw new UnAuthorisedError(
        RESPONSE_MESSAGE.UNAUTHORISED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }
  }
}
