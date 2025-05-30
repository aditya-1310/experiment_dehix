// Endpoint for hiring a Dehix Talent by a specific business ID
export const HIRE_CREATE_ENDPOINT = "/hire-dehixtalent";

// Endpoint for updating a hire record for Dehix Talent by its hire ID
export const HIRE_UPDATE_BY_ID_ENDPOINT =
  "/hire-dehixtalent/:hire_dehixtalent_id";

// Endpoint for deleting a hire record for Dehix Talent by its hire ID
export const HIRE_DELETE_BY_ID_ENDPOINT =
  "/hire-dehixtalent/:hire_dehixtalent_id";

// Endpoint for retrieving hire details of Dehix Talent for a specific business ID
export const GET_HIRE_BY_ID_ENDPOINT = "/hire-dehixtalent";

// Endpoint for updating a specific hire record for Dehix Talent by business ID and hire ID
export const HIRE_DEHIX_TALENT_UPDATE_BY_ID =
  "/hire-dehixtalent/:hireDehixTalent_id";

// Endpoint for add Dehix Talent into Hire Talent lobby by hireDehixTalent ID
export const ADD_TALENT_INTO_LOBBY_ENDPOINT =
  "/hire-dehixtalent/add_into_lobby";

//Endpoint for updating bookmarked boolean by hire Id
export const UPDATE_BOOKMARKED_BY_ID =
  "/hire-dehixtalent/bookmarked/:hireDehixTalent_id";

// Endpoint for invite Dehix Talent into Hire Talent hireDehixTalent ID
export const INVITE_DEHIX_TALENT_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/invite";

// Endpoint for invite Dehix Talent into Hire Talent hireDehixTalent ID
export const REJECT_DEHIX_TALENT_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/reject";

// Endpoint for invite Dehix Talent into Hire Talent hireDehixTalent ID
export const SELECT_DEHIX_TALENT_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/select";

// Endpoint for fetching Dehix Talent in lobby by hireDehixTalent ID
export const GET_DEHIX_TALENT_IN_LOBBY_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/in-lobby";

// Endpoint for fetching invited Dehix Talent by hireDehixTalent ID
export const GET_INVITED_DEHIX_TALENT_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/invited";

// Endpoint for fetching rejected Dehix Talent by hireDehixTalent ID
export const GET_REJECTED_DEHIX_TALENT_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/rejected";

// Endpoint for fetching selected Dehix Talent by hireDehixTalent ID
export const GET_SELECTED_DEHIX_TALENT_ENDPOINT =
  "/hire-dehixtalent/:hireDehixTalent_id/selected";
