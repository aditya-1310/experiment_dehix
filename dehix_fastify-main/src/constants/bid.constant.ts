// Define the base endpoint for bid-related operations
export const BID_ENDPOINT = "/bid";

// Endpoint for updating a specific bid by its unique ID
export const UPDATE_BID_BY_ID_ENDPOINT = "/:bid_id";

// Endpoint for updating the status of a specific bid by its unique ID
export const UPDATE_BID_STATUS_BY_ID_ENDPOINT = "/:bid_id/status";

// Endpoint for retrieving all bids associated with a specific project by its project ID
export const BID_ID_BUSINESS_END_POINT = "/:project_id/bids";

// Endpoint for retrieving a bid associated with a specific freelancer by their bidder ID
export const BID_ID_FREELANCER_END_POINT = "/:bidder_id/bid";

// Endpoint for deleting a specific bid by its unique ID
export const DELETE_BID_END_POINT = "/:bid_id";

// Endpoint for retrieving a bid by project ID within a specific project
export const GET_BID_BY_PROJECT_END_POINT = "/project/:project_id/bid";

// Endpoint for retrieving a bid by project ID and profile ID within a specific profile and project
export const GET_BID_BY_PROJECT_PROFILE_END_POINT =
  "/project/:project_id/profile/:profile_id/bid";

// Endpoint for retrieving all bids
export const ALL_BID_ENDPOINT = "";
