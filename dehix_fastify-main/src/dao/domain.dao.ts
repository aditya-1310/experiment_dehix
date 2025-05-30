import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { DomainModel, IDomain, DomainStatus } from "../models/domain.entity"; // Import DomainStatus Enum
import { v4 as uuidv4 } from "uuid";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class DomainDAO extends BaseDAO {
  model: Model<IDomain>;

  constructor() {
    super();
    this.model = DomainModel;
  }

  // Count the total number of domains
  async countDomains(): Promise<number> {
    try {
      return await this.model.countDocuments();
    } catch (error: any) {
      throw new Error(`Failed to count domains: ${error.message}`);
    }
  }

  // Add new domains
  async addDomain(domainsData: Partial<IDomain>[]): Promise<IDomain[]> {
    try {
      const insertedDomains = await Promise.all(
        domainsData.map(async (domainData) => {
          const domain = await this.model.create({
            _id: uuidv4(),
            createdBy: "admin", // Assuming admin for now
            status: DomainStatus.ACTIVE, // Using the enum for consistency
            ...domainData,
          });
          return domain;
        }),
      );
      return insertedDomains;
    } catch (error: any) {
      throw new Error(`Failed to add domains: ${error.message}`);
    }
  }

  // Find a domain by ID
  async findDomain(domain_id: string): Promise<IDomain | null> {
    try {
      return await this.model.findById(domain_id);
    } catch (error: any) {
      throw new Error(`Failed to find domain: ${error.message}`);
    }
  }

  // Get all active domains
  async getAllDomain(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ): Promise<IDomain[]> {
    try {
      return await fetchDataWithQueries(this.model, filters, page, limit); // Filter by active status
    } catch (error: any) {
      throw new Error(`Failed to fetch domains: ${error.message}`);
    }
  }

  // Get all domains (admin access)
  async getAllDomainAdmin(): Promise<IDomain[]> {
    try {
      return await this.model.find(); // Fetch all domains regardless of status
    } catch (error: any) {
      throw new Error(`Failed to fetch domains for admin: ${error.message}`);
    }
  }

  // Delete a domain by ID
  async deleteDomain(id: string): Promise<IDomain | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error: any) {
      throw new Error(`Failed to delete domain: ${error.message}`);
    }
  }

  // Create a new domain
  async createDomain(data: Partial<IDomain>): Promise<IDomain> {
    try {
      const existingDomain = await this.model.findOne({ label: data.label });
      if (existingDomain) throw new Error("Domain already exists!");

      return await this.model.create({
        status: DomainStatus.ACTIVE, // Default to active status
        ...data,
      });
    } catch (error: any) {
      throw new Error(`Failed to create domain: ${error.message}`);
    }
  }

  // Find a domain by ID
  async findDomainById(id: string): Promise<IDomain | null> {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      throw new Error(`Failed to find domain by ID: ${error.message}`);
    }
  }

  // Update a domain by ID
  async updateDomain(
    id: string,
    update: Partial<IDomain>,
  ): Promise<IDomain | null> {
    try {
      const domainUpdate = update.status
        ? { ...update, status: update.status } // Ensure status is updated correctly
        : update;

      return await this.model.findByIdAndUpdate(id, domainUpdate, {
        new: true,
      });
    } catch (error: any) {
      throw new Error(`Failed to update domain: ${error.message}`);
    }
  }
}
