import { CustomerType, TicketStatus } from "../../../models/ticket.entity";

export interface CreateTicketBody {
  customerID: string;
  customerType: CustomerType; // Using the CustomerType enum here
  description: string;
  filesAttached: string;
  status: TicketStatus; // Using the TicketStatus enum here
  subject: string;
}
