import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, POST, GET } from "fastify-decorators";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";
import {
  createMeetLink,
  getGoogleAuthUrl,
} from "../common/services/calender.service";
import {
  createAuthUrlSchema,
  createMeetSchema,
} from "../schema/v1/calender/calender.create";

@Controller({ route: "/meeting" })
export default class CalendarController extends AuthController {
  // API to create a Google Calendar meeting with a Google Meet link
  @POST("", {
    schema: createMeetSchema,
  })
  async createMeeting(
    request: FastifyRequest<{
      Body: {
        summary: string;
        description: string;
        start: { dateTime: string; timeZone: string };
        end: { dateTime: string; timeZone: string };
        attendees: string[];
      };
      Querystring: { code: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("Creating a new Google Calendar meeting");

      const { summary, description, start, end, attendees } = request.body;
      const { code } = request.query;

      if (!code) {
        return reply.status(400).send({
          message: "Code parameter is required",
          code: "BAD_REQUEST_ERROR",
        });
      }

      if (!attendees || attendees.length === 0) {
        return reply.status(400).send({
          message: "At least one attendee is required",
          code: "BAD_REQUEST_ERROR",
        });
      }

      // Create Google Calendar meeting link with all required fields
      const meetLink = await createMeetLink(
        code,
        attendees,
        summary,
        description,
        start,
        end,
      );

      return reply.status(200).send({
        message: "Meeting scheduled successfully",
        meetLink,
      });
    } catch (error: any) {
      this.logger.error(
        "Error creating Google Calendar meeting",
        error.message,
      );
      return reply.status(500).send({
        message: "Internal Server Error",
        code: "SERVER_ERROR",
      });
    }
  }

  // New API to get the Google OAuth authentication URL
  @GET("/auth-url", {
    schema: createAuthUrlSchema,
  })
  async getGoogleAuthUrl(
    request: FastifyRequest<{ Querystring: { redirectUri: string } }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("Generating Google OAuth authentication URL");

      // Get redirectUri from query string
      const { redirectUri } = request.query;
      this.logger.info(`URL: ${redirectUri}`);
      if (!redirectUri) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: "Redirect URI is required",
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      // Generate the authentication URL with the redirect URI
      const authUrl = getGoogleAuthUrl(redirectUri);
      return reply.status(STATUS_CODES.SUCCESS).send({ url: authUrl });
    } catch (error: any) {
      this.logger.error("Error generating Google OAuth URL", error.message);
      return reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
}
