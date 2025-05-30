/* eslint-disable @typescript-eslint/return-await */
import { FastifyInstance } from "fastify";
import { FastifyInstanceToken, Inject, Service } from "fastify-decorators";
import mongoose, {
  Model,
  Document,
  Types,
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
} from "mongoose";
import { logger } from "./services/logger.service";

@Service()
export abstract class BaseDAO {
  // Inject the Fastify instance to access server utilities and configuration.
  @Inject(FastifyInstanceToken) fastifyInstance!: FastifyInstance;

  /**
   * Generic method to create a new document in the collection
   * @param model - The Mongoose model representing the collection
   * @param data - The data to be inserted as a new document
   * @returns The newly created document
   */
  async create<T extends Document>(model: Model<T>, data: any): Promise<T> {
    const result = new model(data);
    await result.save(); // Save the document to the database
    return result;
  }

  /**
   * Method to update a document by its ID
   * @param model - The Mongoose model representing the collection
   * @param id - The document's ID to be updated
   * @param data - The updated data
   * @returns The updated document or null if not found
   */
  async updateById<T extends Document>(
    model: Model<T>,
    id: Types.ObjectId | string,
    data: any,
  ): Promise<T | null> {
    return await model.findByIdAndUpdate(id, data, { new: true }).exec(); // Return the updated document
  }

  /**
   * Method to delete a document by its ID
   * @param model - The Mongoose model representing the collection
   * @param id - The document's ID to be deleted
   * @returns The deleted document or null if not found
   */
  async delete<T extends Document>(
    model: Model<T>,
    id: Types.ObjectId | string,
  ): Promise<T | null> {
    logger.info(
      `Deleting in collection ${model.collection.name} for id : ${id}`,
    );
    return await model.findByIdAndDelete(id).exec(); // Remove document and return it
  }

  /**
   * Generic function to upsert data for the model reference
   * @param model
   * @param data
   * @param condition
   * @returns
   */
  async upsert<T extends Document>(
    model: Model<T>,
    data: any,
    condition: FilterQuery<T>,
  ): Promise<T | null> {
    return await model
      .findOneAndUpdate(condition, data, { upsert: true, new: true })
      .exec(); // Perform upsert operation
  }

  /**
   * Method to find documents by an array of IDs and ensure they are not marked as deleted
   * @param model - The Mongoose model representing the collection
   * @param ids - Array of IDs to search for
   * @returns Array of found documents
   */
  async findByIdsAndDateDeletedIsNull<T extends Document>(
    model: Model<T>,
    ids: (Types.ObjectId | string)[],
  ): Promise<T[]> {
    return model
      .find({
        _id: { $in: ids }, // Match the documents with the specified IDs
        deletedAt: { $exists: false }, // Exclude deleted documents
      })
      .exec();
  }

  /**
   * Method to update a model row by id
   * @param model
   * @param data
   * @param id
   * @returns
   */
  async update<T extends Document>(
    model: Model<T>,
    data: any,
    id: Types.ObjectId | string,
  ): Promise<T | null> {
    logger.info(
      `BaseDAO -> update :: updating the details on collection ${model.collection.name} with row id = ${id} `,
    );
    return await model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Method to find model element by id
   * @param model
   * @param id
   * @returns
   */
  async findById<T extends Document>(
    model: Model<T>,
    id: Types.ObjectId | string,
  ): Promise<T | null> {
    logger.info(
      `BaseDAO -> findById :: finding in collection ${model.collection.name} , id = ${id} `,
    );
    return await model.findById(id).exec();
  }

  /**
   * Method to find one result that matches a condition
   * @param model - The Mongoose model representing the collection
   * @param condition - The condition to search for
   * @param attributes - Optional array of attributes to project in the result
   * @returns The found document or null if not found
   */
  async findOne<T extends Document>(
    model: Model<T>,
    condition: FilterQuery<T>,
    attributes?: string[],
  ): Promise<T | null> {
    logger.info(condition);
    const projection = attributes
      ? attributes.reduce((acc, attr) => {
          acc[attr] = 1; // Create projection for specified fields
          return acc;
        }, {} as ProjectionType<T>)
      : {};
    const result = await model.findOne(condition, projection).exec();
    logger.info(result);
    return result;
  }

  /**
   * Method to get transaction object
   * @returns ClientSession obj
   */
  async getTransaction(): Promise<ClientSession> {
    return mongoose.startSession(); // Start a new session for MongoDB transactions
  }

  /**
   * Method to find all result that matches a condition
   * @param model - The Mongoose model representing the collection
   * @param condition - The condition to search for
   * @param attributes - Optional array of attributes to project in the result
   * @param paginationOptions - Optional query options for pagination and sorting
   * @returns Array of found documents
   */
  async findAll<T extends Document>(
    model: Model<T>,
    condition: FilterQuery<T>,
    attributes?: string[],
    paginationOptions?: QueryOptions<T>,
  ): Promise<T[]> {
    const projection = attributes
      ? attributes.reduce((acc, attr) => {
          acc[attr] = 1;
          return acc;
        }, {} as ProjectionType<T>)
      : {};
    return await model.find(condition, projection, paginationOptions).exec();
  }

  /**
   * Method to bulk update by ids
   * @param model
   * @param data
   * @param ids
   * @returns
   */
  async bulkUpdate<T extends Document>(
    model: Model<T>,
    data: any,
    ids: (Types.ObjectId | string)[],
  ): Promise<any> {
    logger.info(
      `BaseDAO -> bulkUpdate :: updating in collection ${model.collection.name} with data = ${data}, ids = ${ids} `,
    );
    return await model.updateMany({ _id: { $in: ids } }, data).exec();
  }

  /**
   * Method to bulk delete records for the given collection
   * @param model
   * @param ids
   * @returns
   */
  async bulkDelete<T extends Document>(
    model: Model<T>,
    ids: (Types.ObjectId | string)[],
  ): Promise<any> {
    logger.info(
      `BaseDAO -> bulkDelete :: deleting in collection ${model.collection.name} where ids = ${ids} `,
    );
    return await model.deleteMany({ _id: { $in: ids } }).exec();
  }

  /**
   * Method to delete multiple documents by specific conditions
   * @param model - The Mongoose model representing the collection
   * @param conditions - Array of conditions for deletion
   * @returns Result of the bulk delete operation
   */
  async bulkDeleteByConditions<T extends Document>(
    model: Model<T>,
    conditions: FilterQuery<T>[],
  ): Promise<any> {
    logger.info(
      `BaseDAO -> bulkDeleteByConditions :: deleting in collection ${model.collection.name} by conditions: ${conditions} `,
    );
    return await model.deleteMany({ $or: conditions }).exec();
  }

  /**
   * Method to create multiple documents in bulk
   * @param model - The Mongoose model representing the collection
   * @param data - Array of data to insert
   * @returns Result of the bulk create operation
   */
  async bulkCreate<T extends Document>(
    model: Model<T>,
    data: any[],
  ): Promise<any> {
    logger.info(
      `BaseDAO -> bulkCreate :: bulk create in collection ${model.collection.name} with data = ${JSON.stringify(data, null, 2)}`,
    );
    return await model.insertMany(data);
  }

  /**
   * Method to soft delete a record for the given collection
   * @param model
   * @param whereCondition
   * @returns
   */
  async softDelete<T extends Document>(
    model: Model<T>,
    whereCondition: FilterQuery<T>,
  ): Promise<any> {
    logger.info(
      `BaseDAO -> softDelete :: soft delete in collection ${model.collection.name}`,
    );
    return await model
      .updateMany(whereCondition, { deletedAt: new Date() })
      .exec();
  }

  /**
   * Method to get all records excluding those with the given IDs
   * @param model
   * @param primaryKeyField
   * @param excludedIds
   * @param conditions
   * @returns
   */
  async findAllExcept<T extends Document>(
    model: Model<T>,
    primaryKeyField: string,
    excludedIds: (Types.ObjectId | string)[],
    conditions: FilterQuery<T>,
  ): Promise<T[]> {
    const whereCondition: FilterQuery<T> = {
      [primaryKeyField]: { $nin: excludedIds },
      ...conditions,
    };

    return model.find(whereCondition).exec();
  }
}
