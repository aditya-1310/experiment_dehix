//Endpoint for verification data
export const VERIFICATION_ENDPOINT = "/verification";

// Endpoint for retrieving all Oracle entries
export const GET_ALL_ORACLE_ENDPOINT = "/oracle";

// Endpoint for updating an Oracle entry by document ID
export const ORACLE_UPDATE_END_POINT = "/:document_id/oracle";

// Endpoint for retrieving or modifying Oracle details for a specific verifier
export const ORACLE_ID_ENDPOINT = "/:verifier_id/oracle";

export const VERIFICATION_BY_VERIFIER_ID = "/verifier/:verifier_id";

export const UPDATE_COMMENT_IN_VERIFICATION = "/:verification_id/update";
