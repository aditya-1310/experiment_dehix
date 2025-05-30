import { Hook } from "fastify-decorators";
import { BaseController } from "./base.controller";
import { BadTokenError } from "./errors";
import { FastifyReply, FastifyRequest } from "fastify";
import { RESPONSE_MESSAGE, STATUS_CODES } from "../common/constants";
import { firebaseClient } from "../common/services/firebase.service";

// AuthController is an abstract class that extends BaseController.
// It contains a hook that validates Firebase authentication tokens for incoming requests.
export abstract class AuthController extends BaseController {
  // The @Hook decorator registers the validateAuth function to be triggered on every request.
  // "onRequest" means the hook is called before the request is processed by the route handler.
  @Hook("onRequest")
  async validateAuth(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    // Extract the 'authorization' header from the request.
    // It checks both 'authorization' and 'Authorization' for case-insensitivity.
    const auth =
      request.headers?.authorization ?? request.headers?.Authorization;

    // Log the incoming request's URL and the authorization header for tracking.
    this.logger.info(
      `AuthController -> validateAuth: url: ${request.url} and headers authorization: ${auth}`,
    );

    // Check if the authorization header is present and starts with "Bearer ".
    // This is the expected format for Firebase token authentication.
    if (typeof auth === "string" && auth.startsWith("Bearer ")) {
      // Extract the token from the authorization header by splitting the string.
      const token = auth.split(" ")[1];

      // Validate the Firebase token using the firebaseClient service.
      // The decoded token is attached to the request object for future use.
      request.decodedToken =
        await firebaseClient.getDecodedFirebaseToken(token);

      request.userId = request.decodedToken?.uid;

      // Log the decoded token for debugging purposes.
      this.logger.info(
        "AuthController: validateAuth: Decoded Token: ",
        request.decodedToken,
      );

      // Log the reply object for debugging.
      // Although the reply object is not modified here, it's logged to check its statusCode.
      this.logger.info(`Reply object: { statusCode: ${reply.statusCode} }`);

      // If the token is valid, simply return and continue to the next request lifecycle step.
      return;
    }

    // If the authorization header is missing or invalid, return an unauthorized response.
    reply
      .code(STATUS_CODES.UNAUTHORISED)
      .send({ error: RESPONSE_MESSAGE.BAD_TOKEN });

    // Throw a BadTokenError with a custom message and status code when the token is invalid or missing.
    throw new BadTokenError(
      RESPONSE_MESSAGE.BAD_TOKEN,
      `${STATUS_CODES.UNAUTHORISED}`,
    );
  }
}
