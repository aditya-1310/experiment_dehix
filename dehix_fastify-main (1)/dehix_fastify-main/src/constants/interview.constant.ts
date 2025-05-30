// Base endpoint for interview-related operations
export const INTERVIEW = "/interview";

// Endpoint for creating a new interview for a specific interviewee by their ID
export const CREATE_INTERVIEW_END_POINT = "/:creator_id";

// Endpoint for updating an existing interview by its interview ID
export const UPDATE_INTERVIEW_END_POINT = "/:interview_id";

// Endpoint for deleting an existing interview by its interview ID
export const DELETE_INTERVIEW_END_POINT = "/:interview_id";

//Endpoint for fetching all interviews
export const GET_ALL_INTERVIEWS = "";

// Endpoint for fetching completed interviews for a specific interviewee by their ID
export const COMPLETED_INTERVIEW_FOR_INTERVIEWEE = "/completed-interview";

// Endpoint for fetching current (ongoing or upcoming) interviews for a specific interviewee by their ID
export const CURRENT_INTERVIEW_FOR_INTERVIEWEE = "/current-interview";

// Endpoint for fetching all interview bids of an interview
export const GET_ALL_INTERVIEW_BIDS = "/:interview_id/interview-bids";

// Endpoint for fetching all interview bid by bid ID
export const GET_INTERVIEW_BID = "/:interview_id/interview-bids/:bid_id";

// Endpoint for fetching interview bid by interviewerId
export const GET_INTERVIEW_BID_BY_INTERVIEWER_ID =
  "/interview-bids/:interviewer_id";

// Endpoint for creating a new interview bid
export const CREATE_INTERVIEW_BID = "/interview-bids/:interview_id";

// Endpoint for updating existing interview bid by interview ID and bid ID
export const UPDATE_INTERVIEW_BID = "/:interview_id/interview-bids/:bid_id";

// Endpoint for deleting existing interview bid by interview ID and bid ID
export const DELETE_INTERVIEW_BID = "/:interview_id/interview-bids/:bid_id";

// Endpoint for selecting the interview bid
export const SELECT_INTERVIEW_BID = "/:interview_id/interview-bids/:bid_id";

// Endpoint for fetching interviewers by talent
export const GET_INTERVIEWER_BY_TALENT = "/interviewers/:talent_id";

//Endpoint for fetching interviews by interviewer's talent
export const GET_INTERVIEWS_BY_INTERVIEWER_TALENT = "/:interviewer_id/talent";
