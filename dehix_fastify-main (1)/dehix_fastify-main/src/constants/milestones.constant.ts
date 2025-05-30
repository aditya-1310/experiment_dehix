// Base endpoint for all milestone-related operations
export const MILESTONES_END_POINT = "/milestones";

// Endpoint for creating a new milestone
export const CREATE_MILESTONE_END_POINT = "";

// Endpoint for retrieving all milestones by user ID
export const GET_MILESTONES_END_POINT = "";

// Endpoint for deleting a specific milestone using its milestone ID
export const DELETE_MILESTONE_END_POINT = "/:milestoneId";

// Endpoint to update the milestone using its milestone ID
export const UPDATE_MILESTONE_BY_ID = "/:milestoneId";

export const UPDATE_TASK_REQUEST = "/:milestoneId/story/:storyId/task/:taskId";

export const UPDATE_TASK =
  "/update/milestone/:milestoneId/story/:storyId/task/:taskId";
