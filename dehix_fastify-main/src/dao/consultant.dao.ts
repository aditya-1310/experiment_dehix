import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { ConsultantModel, IConsultant } from "../models/consultant.entity";
@Service()
export class ConsultantDao extends BaseDAO {
  model: Model<IConsultant>;
  constructor() {
    super();
    this.model = ConsultantModel;
  }
  async createConsultant(data: any) {
    return this.model.create(data);
  }
  async updateConsultant(consultant_id: string, update: any) {
    return this.model.findByIdAndUpdate(consultant_id, update);
  }
  async getConsultantById(consulant_id: string) {
    return this.model.findById(consulant_id);
  }
  async getAllConsultant(page: string = "1", limit: string = "20") {
    const pages = parseInt(page) - 1;
    const pageSize = parseInt(limit);
    const pageIndex = pages * pageSize;
    return this.model.find().skip(pageIndex).limit(pageSize);
  }
  async deleteConsultant(consultant_id: string) {
    return this.model.findByIdAndDelete(consultant_id);
  }
}
