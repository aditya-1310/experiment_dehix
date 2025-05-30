// Base endpoint for all FAQ-related operations
export const FAQ_ENDPOINT = "/faq";

// Endpoint to delete a specific FAQ by its unique FAQ ID
export const FAQ_DELETE_BY_ID_ENDPOINT = "/:faq_id";

// Endpoint to retrieve all FAQs in the system
export const FAQ_ALL_ENDPOINT = "";

//Endpoint to get faqs by support tag
export const FAQ_BY_TAG_ENDPOINT = "/tags";

// Endpoint to update a specific FAQ by its unique FAQ ID
export const FAQ_UPDATE_BY_ID_ENDPOINT = "/:faq_id";

// Endpoint to update the status of a faq using its faq ID
export const UPDATE_STATUS_OF_FAQ_BY_FAQ_ID = "/:faq_id/status";
