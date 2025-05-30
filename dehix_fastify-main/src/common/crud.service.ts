import { Service } from "fastify-decorators";

@Service()
export default class CRUDService {
  // Declare DAOs (Data Access Objects) that will be injected into service methods.

  // Create a new record in the database using the provided DAO reference and request body data.
  async create({ daoRef, request }) {
    // Persist in db
    const daoInstance = new daoRef();

    // Call the create method of the DAO to persist the data in the database.
    const data = daoInstance.create({ em: request.em, data: request.body });

    // Return the newly created record.
    return data;
  }

  // Fetch a record from the database by its ID using the provided DAO reference.
  async getById({ daoRef, request }) {
    // Instantiate a new DAO object.
    const daoInstance = new daoRef();

    // Fetch the record by ID from the database using the DAO's getById method.
    const item = await daoInstance.getById({
      em: request.em,
      id: request.params.id,
    });

    // Return the fetched record.
    return item;
  }

  // Delete a record from the database by its ID using the provided DAO reference.
  async delete({ daoRef, request }) {
    // Instantiate a new DAO object.
    const daoInstance = new daoRef();

    // Call the delete method of the DAO to remove the record from the database.
    const item = await daoInstance.delete({
      em: request.em,
      id: request.params.id,
    });

    // If no item was found and deleted, return false.
    if (!item) return false;

    // Return true to indicate successful deletion.
    return true;
  }

  // Update an existing record in the database by its ID using the provided DAO reference.
  async update({ daoRef, request }) {
    // Instantiate a new DAO object.
    const daoInstance = new daoRef();

    // Fetch the existing record from the database, throw an error if not found.
    const exisitingRecord = await request.em.findOneOrFail(
      daoInstance,
      request.params.id,
    );

    // Call the update method of the DAO to apply the updates.
    const item = await daoInstance.update({
      em: request.em,
      record: exisitingRecord,
      newData: request.body,
    });

    // Check if the post exists
    if (!item) {
      return null;
    }

    // Update key-value pairs in the entity
    Object.assign(item, request.body);

    // Persist the updated record back to the database.
    await request.em.flush();

    // Return the updated record.
    return item;
  }

  // Fetch all records from the database using the provided DAO reference.
  async getAll({ daoRef, request }) {
    // Instantiate a new DAO object.
    const daoInstance = new daoRef();

    // Fetch all records using the DAO's getAll method.
    const items = daoInstance.getAll({ em: request.em });

    // Return the list of records.
    return items;
  }
}
