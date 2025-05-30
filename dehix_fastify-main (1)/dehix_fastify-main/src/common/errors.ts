/*
Different types of errors that the application can throw.
These custom error classes help categorize and manage different error states within the application.
*/

// Represents an error related to an invalid or malformed token.
export class BadTokenError extends Error {
  constructor(
    public message: string, // Error message describing the issue.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents an error indicating that a user is unauthorized to perform a specific action.
export class UnAuthorisedError extends Error {
  constructor(
    public message: string, // Error message describing the issue.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents an error that occurs during data validation.
export class DataValidationError extends Error {
  constructor(
    public message: string, // Error message describing the validation issue.
    public statusCode: string, // HTTP status code associated with the error.
    public data?: any, // Optional additional data that triggered the validation error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents a generic server error, usually indicating a problem on the server side.
export class ServerError extends Error {
  constructor(
    public message: string, // Error message describing the server issue.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents an error indicating that a requested resource was not found.
export class NotFoundError extends Error {
  constructor(
    public message: string, // Error message describing the not-found issue.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents an error that occurs during the creation of a resource.
export class CreationError extends Error {
  constructor(
    public message: string, // Error message describing the creation issue.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents a bad request error, indicating that the request was invalid.
export class BadRequestError extends Error {
  constructor(
    public message: string, // Error message describing the bad request.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}

// Represents a conflict error, indicating that the request could not be completed due to a conflict with the current state of the resource.
export class ConflictError extends Error {
  constructor(
    public message: string, // Error message describing the conflict issue.
    public statusCode: string, // HTTP status code associated with the error.
  ) {
    super(); // Call the parent constructor to ensure proper error initialization.
  }
}
