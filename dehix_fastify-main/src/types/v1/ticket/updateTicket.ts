import { TicketStatus } from "../../../models/ticket.entity";

export interface PutTicketBody {
  customerType?: string;
  description?: string;
  subject?: string;
}

export interface PutTicketStatusBody {
  status: TicketStatus;
}
