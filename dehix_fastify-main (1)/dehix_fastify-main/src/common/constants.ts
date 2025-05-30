// Status codes representing different HTTP responses
export const STATUS_CODES = {
  SUCCESS: 200, // Successful request
  UNAUTHORISED: 401, // Unauthorized access
  BAD_REQUEST: 400, // Client sent an invalid request
  METHOD_NOT_FOUND: 405, // HTTP method not allowed
  SERVER_ERROR: 500, // Internal server error
  NOT_FOUND: 404, // Requested resource not found
  UN_PROCESSABLE: 422, // Unprocessable entity
  NO_CONTENT: 204, // Successful request but no content to return
  CREATED: 201, // Resource successfully created
  SPECIAL_STATUS: 600, // Custom application-specific status code
  FORBIDDEN: 403, // Access to resource is forbidden
  CONFLICT: 409, // Conflict in the request (e.g., duplicate data)
};

// Predefined response messages for various operations
export const RESPONSE_MESSAGE = {
  SUCCESS: "Success", // General success message
  CREATED: "Created", // Resource successfully created
  BAD_REQUEST: "Bad request", // Client sent an invalid request
  CUSTOM_TOKEN_GENERATION_FAILED: "Error generating custom token from Firebase", // Firebase token error
  REQUEST_DATA_INVALID: "Invalid data in the request body", // Validation error for request data
  DATA_NOT_FOUND: "Data not found", // General data not found message
  BAD_TOKEN: "Invalid token", // Token validation failed
  INVALID_EMAIL_OR_PASSWORD: "Email or password is invalid", // Invalid login credentials
  UNAUTHORISED: "UNAUTHORISED", // Unauthorized access message
  DATABASE_REQUEST_ERROR: "Database request error", // Error occurred during database request
  EXPIRED_TOKEN: "This token is expired", // Expired token error
  AUTHENTICATION_FAILED: "Failed to authenticate token.", // Token authentication failed
  SERVER_ERROR: "Internal server Error", // General server error
  TOKEN_VERIFICATION_FAILED:
    "Something went wrong with the token verification.", // Token verification issue
  NOT_FOUND: (entity: string = "User") => `${entity} not found`, // Entity not found
  INVALID: (entity: string = "User") => `${entity} not valid`, // Invalid entity error
  USER_NOT_FOUND: "User not found", // User not found
  USER_EXISTS: "User already exists", // User already exists
  FREELANCER_PROJECT_NOT_FOUND: "Freelancer project not found by id", // Freelancer project not found
  PROJECT_NOT_FOUND: "Project by provided ID was not found.", // Project not found by ID
  DRAFT_SUB_NOT_FOUND: "No subscription found for this draft owner", // No draft subscription found
  FREELANCER_NOT_FOUND: "Freelancer with provided ID could not be found.", // Freelancer not found
  BUSINESS_NOT_FOUND: "Business with provided ID could not be found.", // Business entity not found
  CONSULTANT_NOT_FOUND: "Consultant with provided ID could not be found", // Consultant not found
  EXPERIENCE_NOT_FOUND: "Freelancer experience not found by id", // Experience not found by ID
  EDUCATION_NOT_FOUND: "Freelancer education not found by id", // Education not found by ID
  PROJECT_NOT_FOUND_EMAIL: "Project not found by email.", // Project not found by email
  PROJECT_NOT_FOUND_BY_ID: "Project not found by id", // Project not found by ID
  BID_NOT_FOUND: "Bid not found by id", // Bid not found by ID

  INTERVIEW_NOT_FOUND: "Interview not found by id", // Interview not found by ID
  HIRE_DEHIX_TALENT_NOT_FOUND: "Hire Dehix Talent not found by id", // Hire talent not found by ID
  DEHIX_TALENT_NOT_FOUND: "Dehix Talent not found", // Dehix Talent not found
  DRAFT_NOT_FOUND: "Draft with provided ID could not be found.", // Draft not found
  DRAFT_IS_INCOMPLETE:
    "This draft is incomplete and cannot be submitted for review", // Incomplete draft error
  HOTEL_LIMIT_REACHED: "The limit for adding new hotels has been reached", // Hotel creation limit reached
  RESTAURANT_LIMIT_REACHED:
    "The limit for adding new restaurants has been reached", // Restaurant creation limit reached
  ALREADY_UNDER_APPROVAL: "This draft is already under approval process", // Draft is already under approval
  VERIFIED_OWNERS_NOT_ALLOWED: "Verified owners are not allowed to proceed", // Verified owners cannot proceed with the action
  STAFF_REGISTERATION_NOT_ALLOWED: "Staff members are not allowed to proceed", // Staff members restricted from proceeding
  STRIPE_CREATE_CUSTOMER_ERROR: "stripe create customer error", // Stripe customer creation error
  STRIPE_CREATE_SESSION_ERROR: "stripe create session error", // Stripe session creation error
  INVALID_TAX_ID_CODE: "Invalid tax id country code", // Invalid tax ID code
  INVALID_TAX_ID: "Invalid tax id", // Invalid tax ID
  NOT_VENUE_TYPE: "NOT_VENUE_TYPE", // Invalid venue type
  NOT_HOTEL_TYPE: "NOT_HOTEL_TYPE", // Invalid hotel type
};

// Email configuration for reset password
export const RESET_PASSWORD_EMAIL_CONSTANTS = {
  SENDER: process.env.SENDER_EMAIL_ID, // Sender email from environment variables
  SUBJECT: "Reset your password", // Subject of the reset password email
  TEXTBODY: "Click on this link to reset your password: :verificationLink", // Email body for password reset
};

// Email configuration for creating a new password
export const CREATE_PASSWORD_EMAIL_CONSTANTS = {
  SENDER: process.env.SENDER_EMAIL_ID, // Sender email from environment variables
  SUBJECT: "Create your password", // Subject of the create password email
  TEXTBODY: "Click on this link to create your password: :passLink", // Email body for creating a new password
};

// Constant for price configuration entity name
export const PRICE_CONFIG_NAME = "PRICE_CONFIG";

// Email configuration for email verification
export const EMAIL_VERIFICATION_EMAIL_CONSTANTS = {
  SENDER: process.env.SENDER_EMAIL_ID, // Sender email from environment variables
  SUBJECT: "Please verify your email", // Subject of the email verification
  TEXTBODY: "Click on this link to verify your email: :verificationLink", // Email body for email verification
};

// Error codes for specific application errors
export const ERROR_CODES = {
  BUSINESS_NOT_FOUND: "BUSINESS_NOT_FOUND", // Business entity not found
  USER_ALREADY_EXIST: "USER_ALREADY_EXIST", // User already exists
  PASSWORDS_DO_NOT_MATCH: "PASSWORDS_DO_NOT_MATCH", // Passwords do not match error
  USER_ALREADY_REGISTERED: "USER_ALREADY_REGISTERED", // User is already registered
  FREELANCER_NOT_FOUND: "FREELANCER_NOT_FOUND", // Freelancer not found by ID
  ADMIN_NOT_FOUND: "ADMIN_NOT_FOUND", // Admin not found by ID
  EXPERIENCE_NOT_FOUND: "EXPERIENCE_NOT_FOUND", // Experience not found by ID
  EDUCATION_NOT_FOUND: "EDUCATION_NOT_FOUND", // Education not found by ID
  FREELANCER_PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND", // Freelancer project not found by ID
  BUSINESS_PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND", // Business project not found
  HIRE_DEHIX_TALENT_NOT_FOUND: "HIRE_DEHIX_TALENT_NOT_FOUND", // Hire Dehix talent not found by ID
  DEHIX_TALENT_NOT_FOUND: "DEHIX_TALENT_NOT_FOUND", // Dehix Talent not found
  OFFERS_NOT_FOUND: "OFFERS_NOT_FOUND", // Offers not found
  OTP_MISMATCH: "OTP_MISMATCH", // One-time password mismatch error
  OTP_EXPIRED: "OTP_EXPIRED", // OTP expired error
  FST_ERR_VALIDATION: "FST_ERR_VALIDATION", // Fastify validation error
  PLAN_NOT_FOUND: "No plan configuration found", // No plan configuration found
  CUSTOM_TOKEN_GENERATION_FAILED: "CUSTOM_TOKEN_GENERATION_FAILED", // Custom token generation failed
  USER_NOT_FOUND: "USER_NOT_FOUND", // User not found
  SUBSCRIPTION_NOT_FOUND: "SUBSCRIPTION_NOT_FOUND", // Subscription not found
  DRAFT_IS_INCOMPLETE: "DRAFT_IS_INCOMPLETE", // Incomplete draft error
  HOTEL_LIMIT_REACHED: "HOTEL_LIMIT_REACHED", // Limit for adding hotels reached
  RESTAURANT_LIMIT_REACHED: "RESTAURANT_LIMIT_REACHED", // Limit for adding restaurants reached
  ALREADY_UNDER_APPROVAL: "ALREADY_UNDER_APPROVAL", // Draft is already under approval
  INVALID_EMAIL_OR_PASSWORD: "INVALID_EMAIL_OR_PASSWORD", // Invalid email or password error
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED", // Email verification error
  STAFF_REGISTERATION_NOT_ALLOWED: "STAFF_REGISTERATION_NOT_ALLOWED", // Staff registration not allowed
  UNAUTHORIZED: "UNAUTHORIZED", // Unauthorized access
  TOKEN_EXPIRED: "TOKEN_EXPIRED", // Token expired
  INVALID_TOKEN: "INVALID_TOKEN", // Invalid token
  TOKEN_VERIFICATION_FAILED: "TOKEN_VERIFICATION_FAILED", // Token verification failed
  STRIPE_SERVER_ERROR: "STRIPE_SERVER_ERROR", // Stripe server error
  INVALID_DATA: "INVALID_DATA", // Invalid data error
  STRIPE_ERROR: "STRIPE_ERROR", // General Stripe error
  SERVER_ERROR: "SERVER_ERROR", // General server error
  BAD_REQUEST_ERROR: "BAD_REQUEST_ERROR", // Bad request error
  INVALID_TAX_ID_CODE: "INVALID_TAX_ID_CODE", // Invalid tax ID country code
  INVALID_TAX_ID: "INVALID_TAX_ID", // Invalid tax ID
  CONFIG_NOT_FOUND: "CONFIG_NOT_FOUND", // Configuration not found
  DRAFT_NOT_FOUND: "DRAFT_NOT_FOUND", // Draft not found
  NOT_FOUND: "NOT_FOUND", // General not found error
  PRICING_NOT_FOUND: "PRICING_NOT_FOUND", // Pricing configuration not found
  VENUE_NOT_FOUND: "VENUE_NOT_FOUND", // Venue not found
  NOT_VENUE_TYPE: "NOT_VENUE_TYPE", // Invalid venue type
  NOT_HOTEL_TYPE: "NOT_HOTEL_TYPE", // Invalid hotel type
};

// Query types used in the application (SQL and data manipulation)
export enum QUERY_TYPES {
  SELECT = "SELECT", // Select query
  INSERT = "INSERT", // Insert query
  UPDATE = "UPDATE", // Update query
  BULKUPDATE = "BULKUPDATE", // Bulk update query
  BULKDELETE = "BULKDELETE", // Bulk delete query
  DELETE = "DELETE", // Delete query
  UPSERT = "UPSERT", // Insert or update (upsert) query
  VERSION = "VERSION", // Version query (for schema or software versions)
  SHOWTABLES = "SHOWTABLES", // Show tables in the database
  SHOWINDEXES = "SHOWINDEXES", // Show indexes on a table
  DESCRIBE = "DESCRIBE", // Describe table structure
  RAW = "RAW", // Execute raw SQL query
  FOREIGNKEYS = "FOREIGNKEYS", // Query foreign keys of a table
  SHOWCONSTRAINTS = "SHOWCONSTRAINTS", // Show constraints on a table
}

// Entity types used in the system
export const ENTITY_TYPE = {
  HOTEL: "HOTEL", // Hotel entity
  INDIVIDUAL_VENUE: "INDIVIDUAL_VENUE", // Individual venue entity
  MULTI_VENUE: "MULTI_VENUE", // Multi venue entity
  KIDS_SPACE: "KIDS_SPACE", // Kids space entity
};

// Categories for amenities in hotels and venues
export enum AmenityCategory {
  RECREATIONAL = "RECREATIONAL", // Recreational amenities
  BUSINESS = "BUSINESS", // Business-related amenities
  ROOM = "ROOM", // Room-specific amenities
  EQUIPMENTS = "EQUIPMENTS", // Equipment-related amenities
  NONE = "NONE", // No specific category
  ALL = "ALL", // All types of amenities
}

// Roles used in the application for user access control
export const ROLES = {
  MANAGER: "MANAGER", // Manager role
  OWNER: "OWNER", // Owner role
};

// JWT secret key for signing and verifying tokens
export const JWT_SECRET_KEY = "Secret key";

// Secret key for encrypting sensitive data
export const ENCRYPTION_SECRET_KEY = "Secret key";

// Number of rounds for salting passwords during encryption
export const PASSWORD_SALT_ROUNDS = 10;

// Types of users stored in Firebase
export const FIREBASE_USER_TYPE = {
  FREELANCER: "FREELANCER", // Freelancer user type
  CUSTOMER: "CUSTOMER", // Customer user type
  FMV_ADMIN: "FMV_ADMIN", // Admin user type
};

// Enum for different types of entities in the system
export enum EntityType {
  HOTEL = "HOTEL", // Hotel entity
  VENUE = "VENUE", // Venue entity
  INDIVIDUAL_VENUE = "INDIVIDUAL_VENUE", // Individual venue entity
  MULTI_VENUE = "MULTI_VENUE", // Multi-venue entity
  KIDS_SPACE = "KIDS_SPACE", // Kids space entity
}

// Mappings for amenity categories based on the entity type
export const AmenityCategoryMappings = {
  HOTEL: ["ROOM", "BUSINESS", "RECREATIONAL"], // Amenities available for hotels
  VENUE: ["EQUIPMENTS", "NONE"], // Amenities available for venues
};

// Stripe webhook endpoint for handling payment-related events
export const STRIPE_WEBHOOK_ENDPOINT = "v1/stripe-webhook";

export interface GetFilterQueryParams {
  filters: Record<string, string[]>;
  page: string;
  limit: string;
}
