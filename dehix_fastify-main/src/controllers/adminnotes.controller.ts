/* eslint-disable prettier/prettier */
import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, Inject, PUT, POST, DELETE, GET } from "fastify-decorators";
import { AuthController } from "../common/auth.controller";
import {
  ADMIN_NOTES_END_POINT,
  CREATE_ADMIN_NOTE_END_POINT,
  UPDATE_STATUS_OF_ADMIN_NOTE_BY_ID,
  DELETE_ADMIN_NOTE_END_POINT,
  ALL_ADMIN_NOTES_END_POINT,
} from "../constants/adminnotes.constant";
import { AdminNotesService } from "../services/adminnotes.service";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import { createAdminNotesSchema } from "../schema/v1/adminnotes/adminnotes.create";
import { deleteAdminNotesSchema } from "../schema/v1/adminnotes/adminnotes.delete";
import { getAllAdminNotesSchema } from "../schema/v1/adminnotes/adminnotes.get";
import { updateAdminNotesSchema } from "../schema/v1/adminnotes/adminnotes.update";
import { deleteAdminNotes } from "../types/v1/adminnotes/deleteAdminNotes";
import {
  PutAdminNotesBody,
  PutAdminNotesPathParams,
} from "../types/v1/adminnotes/updateAdminNotes";
import { createAdminNotes } from "../types/v1/adminnotes/createAdminNotes";

@Controller({ route: ADMIN_NOTES_END_POINT }) // Adjust to match your route prefix
export default class AdminNotesController extends AuthController {
  @Inject(AdminNotesService)
  AdminNotesService!: AdminNotesService;

  @GET(ALL_ADMIN_NOTES_END_POINT, { schema: getAllAdminNotesSchema })
  async getAllNotes(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(`AdminNotesController -> getAllNotes -> Fetching notes`);

      const data = await this.AdminNotesService.getAllNotes();

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error fetching admin notes: ${error.message}`);

      // Handle specific cases such as no data being found or project not being found
      if (
        error.code === ERROR_CODES.NOT_FOUND ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(CREATE_ADMIN_NOTE_END_POINT, { schema: createAdminNotesSchema })
  async createNotes(
    request: FastifyRequest<{ Body: createAdminNotes }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`NotesController -> createNotes -> Creating a new note`);
      const body: any = request.body;
      const note = await this.AdminNotesService.createAdminNotes(body);
      reply.status(STATUS_CODES.SUCCESS).send({ note });
    } catch (error: any) {
      this.logger.error(`Error in CreateTicket: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(DELETE_ADMIN_NOTE_END_POINT, { schema: deleteAdminNotesSchema })
  async deleteNotes(
    request: FastifyRequest<{ Params: deleteAdminNotes }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`NotesController -> deleteNotes -> Deleting note`);

      const noteID: string = request.params.note_id;
      const deleteNote =
        await this.AdminNotesService.deleteAdminNoteById(noteID);

      reply.status(STATUS_CODES.SUCCESS).send({ deleteNote });
    } catch (error: any) {
      this.logger.error(`Error in delete note: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(UPDATE_STATUS_OF_ADMIN_NOTE_BY_ID, { schema: updateAdminNotesSchema })
  async updateNotes(
    request: FastifyRequest<{
      Params: PutAdminNotesPathParams;
      Body: PutAdminNotesBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`NotesController -> updateNotes -> Updating note`);
      const noteID: string = request.params.note_id;
      const noteData: any = request.body;

      const updateNote = await this.AdminNotesService.updateAdminNoteById(
        noteID,
        noteData,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ updateNote });
    } catch (error: any) {
      this.logger.error(`Error in updating note: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }
}
