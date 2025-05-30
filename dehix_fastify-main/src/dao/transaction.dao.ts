import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { TransactionModel, ITransaction } from "../models/transaction.entity";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class TransactionDAO extends BaseDAO {
  model: Model<ITransaction>;

  constructor() {
    super();
    this.model = TransactionModel;
  }

  async createTransaction(data: any) {
    return this.model.create(data);
  }
  async getAllTransaction(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    return await fetchDataWithQueries(this.model, filters, page, limit);
  }

  async getTransactionByID(transaction_id: string) {
    const data = await this.model.findById(transaction_id);
    return data;
  }
  async deleteTransaction(transaction_id: string) {
    return this.model.findByIdAndDelete(transaction_id);
  }
  async getTransactionByType(
    type: "payment" | "referral" | "rewards" | "system generated",
  ) {
    try {
      const query = {
        ...(type && { type }),
      };
      const TransactionData = await this.model.find(query);
      return TransactionData;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction data: ${error.message}`);
    }
  }
  async getTransactionByFromType(
    from_type: "system" | "freelancer" | "business" | "admin",
  ) {
    try {
      const query = {
        ...(from_type && { from_type }),
      };
      const TransactionData = await this.model.find(query);
      return TransactionData;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction data: ${error.message}`);
    }
  }

  async getTransactionByFrom(from: string) {
    try {
      const query = {
        ...(from && { from }),
      };
      const TransactionData = await this.model.find(query);
      return TransactionData;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction data: ${error.message}`);
    }
  }

  async getTransactionByTo(to: string) {
    try {
      const query = {
        ...(to && { to }),
      };
      const TransactionData = await this.model.find(query);
      return TransactionData;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction data: ${error.message}`);
    }
  }
  async getTransactionByReferenceId(reference_id: string) {
    try {
      const query = {
        ...(reference_id && { reference_id }),
      };
      const TransactionData = await this.model.find(query);
      return TransactionData;
    } catch (error: any) {
      throw new Error(`Failed to fetch transaction data: ${error.message}`);
    }
  }
  async updateTransaction(transaction_id: string, update: any) {
    return this.model.findByIdAndUpdate({ _id: transaction_id }, update, {
      new: true,
    });
  }
}
