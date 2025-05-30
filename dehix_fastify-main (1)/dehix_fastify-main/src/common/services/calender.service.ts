import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

// Configuration for Google OAuth2 client (without redirect URI)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

// Google Calendar API instance
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Scopes for the Google Calendar API
const scopes = ["https://www.googleapis.com/auth/calendar"];

// Function to generate the authentication URL with a dynamic redirect URI
export const getGoogleAuthUrl = (redirectUri: string): string => {
  // Use the redirectUri as an option in generateAuthUrl
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: redirectUri, // Pass the redirect URI dynamically
  });
};

// Function to handle the OAuth2 callback and set credentials
export const handleAuthCallback = async (code: string): Promise<void> => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
};

// Function to create a Google Calendar event with a meet link
export const createMeetLink = async (
  code: string,
  attendees: string[],
  summary: string,
  description: string,
  start: { dateTime: string; timeZone: string },
  end: { dateTime: string; timeZone: string },
): Promise<string | null | undefined> => {
  try {
    await handleAuthCallback(code); // Await the callback handling for OAuth2

    const event = await calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client, // Assuming oauth2Client is already initialized
      conferenceDataVersion: 1,
      requestBody: {
        summary, // Use the provided summary
        description, // Use the provided description
        start: {
          dateTime: start.dateTime, // Use provided start dateTime and timeZone
          timeZone: start.timeZone,
        },
        end: {
          dateTime: end.dateTime, // Use provided end dateTime and timeZone
          timeZone: end.timeZone,
        },
        conferenceData: {
          createRequest: {
            requestId: uuidv4(), // Generate a unique request ID for Google Meet
            conferenceSolutionKey: {
              type: "hangoutsMeet", // Create a Google Meet link
            },
          },
        },
        attendees: attendees.map((email) => ({ email })), // Use provided attendee emails
      },
    });

    return event.data.hangoutLink; // Return the meeting lin
  } catch (error) {
    console.log("Error creating event: ", error);
    throw new Error("Error scheduling meeting");
  }
};
