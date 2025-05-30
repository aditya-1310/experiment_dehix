import { FastifyRequest, FastifyReply } from "fastify";
import {
  Controller,
  GET,
  Inject,
  PUT,
  PATCH,
  POST,
  DELETE,
} from "fastify-decorators";
import { AuthController } from "../common/auth.controller";
import {
  NOTES_END_POINT,
  CREATE_NOTE_END_POINT,
  DELETE_NOTE_END_POINT,
  GET_NOTE_END_POINT,
  UPDATE_NOTE_BY_ID,
  UPDATE_NOTE_ORDER,
} from "../constants/notes.constant";
import { NotesService } from "../services/notes.service";
import { createNotes } from "../types/v1/notes/createNotes";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import { createNotesSchema } from "../schema/v1/notes/notes.create";
import { getNotesSchema } from "../schema/v1/notes/notes.get";
import { deleteNotesSchema } from "../schema/v1/notes/notes.delete";
import { deleteNotes } from "../types/v1/notes/deleteNote";
import { updateNotesSchema } from "../schema/v1/notes/notes.update";
import {
  PutNotesBody,
  PutNotesPathParams,
  UpdateNoteOrderBody,
} from "../types/v1/notes/updateNotes";
import { updateNoteOrderSchema } from "../schema/v1/notes/notesorder.update";

@Controller({ route: NOTES_END_POINT }) // Adjust to match your route prefix
export default class NotesController extends AuthController {
  @Inject(NotesService)
  NotesService!: NotesService;

  @POST(CREATE_NOTE_END_POINT, { schema: createNotesSchema })
  async createNotes(
    request: FastifyRequest<{ Body: createNotes }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`NotesController -> createNotes -> Creating a new note`);

      const body: any = request.body;
      const note = await this.NotesService.createNotes(body);
      reply.status(STATUS_CODES.SUCCESS).send({ note });
    } catch (error: any) {
      this.logger.error(`Error in CreateTicket: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(GET_NOTE_END_POINT, { schema: getNotesSchema })
  async getNotes(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.userId;

      this.logger.info(
        `NotesController -> getNotes -> Fetching notes for ${userId}`,
      );

      const notesData = await this.NotesService.getNotes({ userId });

      // Return the fetched notes
      reply.status(STATUS_CODES.SUCCESS).send({ notes: notesData });
    } catch (error: any) {
      this.logger.error(`Error in getNotes: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(DELETE_NOTE_END_POINT, { schema: deleteNotesSchema })
  async deleteNotes(
    request: FastifyRequest<{ Params: deleteNotes }>,

    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`NotesController -> deleteNotes -> Deleting note`);

      const noteID: string = request.params.note_id;
      const deleteNote = await this.NotesService.deleteNoteById(noteID);

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

  @PUT(UPDATE_NOTE_BY_ID, { schema: updateNotesSchema })
  async updateNotes(
    request: FastifyRequest<{
      Params: PutNotesPathParams;
      Body: PutNotesBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`NotesController -> updateNotes -> Updating note`);
      const noteID: string = request.params.note_id;
      const noteData: any = request.body;

      const updatedNote = await this.NotesService.updateNoteById(
        noteID,
        noteData,
      );

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Note updated successfully",
        data: updatedNote,
      });
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

  @PATCH(UPDATE_NOTE_ORDER, { schema: updateNoteOrderSchema })
  async updateNoteOrder(
    request: FastifyRequest<{ Body: UpdateNoteOrderBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `NotesController -> updateNoteOrder -> Updating notes order`,
      );

      const { noteOrder } = request.body;
      const userId = request.userId;

      const updatedOrder = await this.NotesService.updateNoteOrder(
        userId,
        noteOrder,
      );

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Notes order updated successfully",
        data: updatedOrder,
      });
    } catch (error: any) {
      this.logger.error(`Error in updateNoteOrder: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
}
