//routes// Base endpoint for all notes-related operations
export const ADMIN_NOTES_END_POINT = "/adminnotes";

// Endpoint for creating a new note
export const CREATE_ADMIN_NOTE_END_POINT = "";

// Endpoint to retrieve, update, or delete a specific note using its unique note ID
export const ADMIN_NOTE_ID_END_POINT = "/:note_id";

// Endpoint for updating a note by its unique note ID
export const ADMIN_NOTE_UPDATE_END_POINT = "/:note_id";

// Endpoint for retrieving all notes in the system
export const ALL_ADMIN_NOTES_END_POINT = "";

// Endpoint for retrieving a note by its unique note ID
export const GET_ADMIN_NOTE_BY_ID = "/:note_id";

// Endpoint for deleting a specific note using its note ID
export const DELETE_ADMIN_NOTE_END_POINT = "/:note_id";

// Endpoint for retrieving all notes associated with a specific business by its business ID
export const GET_ADMIN_NOTES_BY_BUSINESS_ID = "/:business_id/adminnotes";

// Endpoint for retrieving all notes associated with a specific user by their user ID
export const GET_ADMIN_NOTES_BY_USER_ID = "/:user_id/adminnotes";

// Endpoint to update the status of a specific note using its note ID
export const UPDATE_STATUS_OF_ADMIN_NOTE_BY_ID = "/:note_id";

export const UPDATE_ADMIN_NOTE_TYPE_END_POINT = "/move/:note_id";
