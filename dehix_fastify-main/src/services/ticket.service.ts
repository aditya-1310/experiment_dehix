import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { TicketDAO } from "../dao/ticket.dao";
import { FaqDAO } from "../dao/faq.dao";
import { SupportTagsDao } from "../dao/supporttags.dao";
import { CustomerType, TicketStatus } from "../models/ticket.entity"; // Import Enums

@Service()
export class TicketService extends BaseService {
  @Inject(TicketDAO)
  private TicketDAO!: TicketDAO;

  @Inject(FaqDAO)
  private FaqDAO!: FaqDAO;

  @Inject(SupportTagsDao)
  private SupportTagsDao!: SupportTagsDao;

  // Create a new ticket
  async create(body: any) {
    try {
      this.logger.info("TicketService: create: Creating new ticket");

      const ticket = await this.TicketDAO.createTicket(body);
      for (const tag of body.supportTags) {
        await this.SupportTagsDao.incrementCountById(tag.tagId);
      }
      return ticket;
    } catch (error: any) {
      throw new Error(RESPONSE_MESSAGE.SERVER_ERROR);
    }
  }

  // Get all tickets
  async getAllTickets(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("TicketService: getAllTickets: Fetching all tickets");

    const tickets = await this.TicketDAO.getAllTicket(filters, page, limit);

    if (tickets.length === 0) {
      this.logger.error("TicketService: getAllTickets: No tickets found");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Ticket"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    return tickets;
  }

  // Delete ticket by ID
  async deleteTicketById(ticket_id: string) {
    this.logger.info(
      `TicketService: deleteTicketById: Deleting ticket ID: ${ticket_id}`,
    );

    const checkTicket = await this.TicketDAO.getTicketByID(ticket_id);
    if (!checkTicket) {
      this.logger.error(
        `TicketService: deleteTicketById: Ticket ID ${ticket_id} not found`,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const deleteTicket = await this.TicketDAO.deleteTicket(ticket_id);
    return deleteTicket;
  }

  // Update ticket by ID
  async updateTicketById(ticket_id: string, body: any) {
    this.logger.info(
      `TicketService: updateTicketById: Updating ticket ID: ${ticket_id}`,
    );

    const checkTicket = await this.TicketDAO.getTicketByID(ticket_id);
    if (!checkTicket) {
      this.logger.error(
        `TicketService: updateTicketById: Ticket ID ${ticket_id} not found`,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const updatedTicket = await this.TicketDAO.updateTicket(ticket_id, body);
    return updatedTicket;
  }

  // Update ticket status by ID
  async updateTicketStatus(ticket_id: string, status: TicketStatus) {
    try {
      this.logger.info(
        `TicketService: updateTicketStatus: Updating status for ticket ID: ${ticket_id} to ${status}`,
      );

      const result = await this.TicketDAO.updateTicketStatus(ticket_id, status);

      if (!result) {
        throw new Error("Failed to update the ticket status. No ticket found.");
      }

      return { message: `Ticket status updated to ${status}` };
    } catch (error: any) {
      this.logger.error(`TicketService: updateTicketStatus: ${error.message}`);
      throw new Error("Failed to update ticket status");
    }
  }

  // Get ticket by ID
  async getTicketById(ticket_id: string) {
    this.logger.info(
      `TicketService: getTicketById: Fetching ticket for ID: ${ticket_id}`,
    );

    const checkTicket = await this.TicketDAO.getTicketByID(ticket_id);
    if (!checkTicket) {
      this.logger.error(
        `TicketService: getTicketById: Ticket ID ${ticket_id} not found`,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    return checkTicket;
  }

  // Get tickets by customer type (business or freelancer)
  async getTicketsByCustomerType(customerType: CustomerType) {
    this.logger.info(
      `TicketService: getTicketsByCustomerType: Fetching tickets for customer type: ${customerType}`,
    );

    return await this.TicketDAO.getTicketsByCustomerType(customerType);
  }

  // Get tickets by status (created, closed, active)
  async getTicketsByStatus(status: TicketStatus) {
    this.logger.info(
      `TicketService: getTicketsByStatus: Fetching tickets with status: ${status}`,
    );

    return await this.TicketDAO.getTicketsByStatus(status);
  }

  // Get tickets by subject
  async getTicketsBySubject(subject: string) {
    this.logger.info(
      `TicketService: getTicketsBySubject: Fetching tickets for subject: ${subject}`,
    );

    return await this.TicketDAO.getTicketsBySubject(subject);
  }

  // Get tickets by customer ID
  async getTicketsByCustomerID(customerID: string) {
    this.logger.info(
      `TicketService: getTicketsByCustomerID: Fetching tickets for customer ID: ${customerID}`,
    );

    return await this.TicketDAO.getTicketsByCustomerID(customerID);
  }

  async ticketToFaq(ticketId: string) {
    this.logger.info(
      `TicketService: ticketToFaq: Converting Token Request ${ticketId} to faq`,
    );
    const ticket = await this.TicketDAO.getTicketByID(ticketId);
    if (!ticket) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Ticket"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    const faqData: any = {
      answer: ticket.solution,
      question: ticket.title,
      type: ticket.customerType,
      supprtTags: ticket.supportTags,
    };
    const faq = await this.FaqDAO.createFaq(faqData);
    if (!faq) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("FAQ"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return faq;
  }
}
