import { CustomerType, TicketStatus } from "../../../models/ticket.entity";

export interface GetTicketPathParams {
  ticket_id: string; // `ticket_id` should always be a string, as it's a path parameter.
}

export interface GetTicketByCustomerTypeQueryParams {
  customerType: CustomerType; // Using the CustomerType enum for customerType.
}

export interface GetTicketByStatusQueryParams {
  status: TicketStatus; // Using the TicketStatus enum for status.
}

export interface GetTicketBySubjectQueryParams {
  subject: string; // Assuming `subject` can be any string.
}

export interface GetTicketByCustomerIDQueryParams {
  customerID: string; // `customerID` is expected to be a string.
}

// Optional query parameters using enums
export interface GetTicketByOptionalCustomerTypeQueryParams {
  customerType?: CustomerType; // Making customerType optional and using the CustomerType enum.
}

export interface GetTicketByOptionalStatusQueryParams {
  status?: TicketStatus; // Making status optional and using the TicketStatus enum.
}

export interface GetTicketByOptionalSubjectQueryParams {
  subject?: string; // Making subject optional.
}

export interface GetTicketByOptionalCustomerIDQueryParams {
  customerID?: string; // Making customerID optional.
}
