import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { TransactionDAO } from "../dao/transaction.dao";

@Service()
export class TransactionService extends BaseService {
  @Inject(TransactionDAO)
  private TransactionDAO!: TransactionDAO;

  async create(body: any) {
    const transaction: any = await this.TransactionDAO.createTransaction(body);
    return transaction;
  }

  async getAllTransaction(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info(
      "TransactionService: getAllTransaction: Fetching All transaction",
    );

    const transaction: any = await this.TransactionDAO.getAllTransaction(
      filters,
      page,
      limit,
    );

    if (transaction.length == 0) {
      this.logger.error(
        "TransactionService: getAllTransaction: Transaction not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return transaction;
  }

  async deleteTransactionById(transaction_id: string) {
    this.logger.info(
      `TransactionService: deleteTransactionById: Deleting Transaction for ID:${transaction_id}`,
    );

    const checkTransaction =
      await this.TransactionDAO.getTransactionByID(transaction_id);
    if (!checkTransaction) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const deleteTransaction =
      await this.TransactionDAO.deleteTransaction(transaction_id);

    return deleteTransaction;
  }

  async getTransactionById(transaction_id: string) {
    this.logger.info(
      `TransactionService: getTranasctionById: Fetching Transaction for ID:${transaction_id}`,
    );

    const checkTransaction: any =
      await this.TransactionDAO.getTransactionByID(transaction_id);
    if (!checkTransaction) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const getTransaction: any =
      await this.TransactionDAO.getTransactionByID(transaction_id);

    return getTransaction;
  }
  async getTransactionByType(
    type: "payment" | "referral" | "rewards" | "system generated",
  ) {
    this.logger.info(
      "TransactionService: getTransactionByType: Fetching transaction for type",
    );
    const Transaction = await this.TransactionDAO.getTransactionByType(type);
    if (!Transaction) {
      this.logger.error(
        "TransactionService: getTransactionByType: Transaction not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return Transaction;
  }
  async getTransactionByFromType(
    from_type: "system" | "freelancer" | "business" | "admin",
  ) {
    this.logger.info(
      "TransactionService: getTransactionByFromType: Fetching transaction for from_type",
    );

    const Transaction =
      await this.TransactionDAO.getTransactionByFromType(from_type);
    if (!Transaction) {
      this.logger.error(
        "TransactionService: getTransactionByFromType: Transaction not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return Transaction;
  }
  async updateTransactionById(transaction_id: string, body: any) {
    this.logger.info(
      `TransactionService: updateTransactionById: Updating Transaction for ID:${transaction_id}`,
    );

    const checkTransaction =
      await this.TransactionDAO.getTransactionByID(transaction_id);
    if (!checkTransaction) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.TransactionDAO.updateTransaction(
      transaction_id,
      body,
    );

    return data;
  }
  async getTransactionByFrom(from: string) {
    this.logger.info(
      "TransactionService: getTransactionByFrom: Fetching transaction for From",
    );
    const Transaction = await this.TransactionDAO.getTransactionByFrom(from);
    if (!Transaction) {
      this.logger.error(
        "TransactionService: getTransactionByType: Transaction not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return Transaction;
  }
  async getTransactionByTo(to: string) {
    this.logger.info(
      "TransactionService: getTransactionByTo: Fetching transaction for To",
    );
    const Transaction = await this.TransactionDAO.getTransactionByTo(to);
    if (!Transaction) {
      this.logger.error(
        "TransactionService: getTransactionByTo: Transaction not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return Transaction;
  }
  async getTransactionByReferenceId(reference_id: string) {
    this.logger.info(
      "TransactionService: getTransactionByReferenceId: Fetching transaction for REferenceId",
    );
    const Transaction =
      await this.TransactionDAO.getTransactionByReferenceId(reference_id);
    if (!Transaction) {
      this.logger.error(
        "TransactionService: getTransactionByReferenceId: Transaction not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return Transaction;
  }
}
