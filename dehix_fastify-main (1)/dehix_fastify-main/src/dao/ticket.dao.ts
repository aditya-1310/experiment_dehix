import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import {
  TicketModel,
  ITicket,
  TicketStatus,
  CustomerType,
} from "../models/ticket.entity";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class TicketDAO extends BaseDAO {
  model: Model<ITicket>;

  constructor() {
    super();
    this.model = TicketModel;
  }

  async createTicket(data: any) {
    return this.model.create(data);
  }

  async getAllTicket(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    return await fetchDataWithQueries(this.model, filters, page, limit);
  }

  async getTicketByID(ticket_id: string) {
    return await this.model.findById(ticket_id);
  }

  async deleteTicket(ticket_id: string) {
    return this.model.findByIdAndDelete(ticket_id);
  }

  async updateTicket(ticket_id: string, update: any) {
    return this.model.findByIdAndUpdate({ _id: ticket_id }, update, {
      new: true,
    });
  }

  async updateTicketStatus(ticket_id: string, status: TicketStatus) {
    try {
      return await this.model.findByIdAndUpdate(
        ticket_id,
        { status, updatedAt: new Date() },
        { new: true },
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw new Error("Failed to update ticket status");
    }
  }

  async getTicketByCustomerID(customerID: string) {
    return await this.model.find({ customerID });
  }

  async getTicketsByCustomerType(customerType: CustomerType) {
    try {
      return await this.model.find({ customerType });
    } catch (error: any) {
      throw new Error(`Failed to fetch ticket data: ${error.message}`);
    }
  }

  async getTicketsByStatus(status: TicketStatus) {
    try {
      return await this.model.find({ status });
    } catch (error: any) {
      throw new Error(`Failed to fetch ticket data: ${error.message}`);
    }
  }

  async getTicketsBySubject(subject: string) {
    try {
      return await this.model.find({ subject });
    } catch (error: any) {
      throw new Error(`Failed to fetch ticket data: ${error.message}`);
    }
  }

  async getTicketsByCustomerID(customerID: string) {
    try {
      return await this.model.find({ customerID });
    } catch (error: any) {
      throw new Error(`Failed to fetch ticket data: ${error.message}`);
    }
  }
}
