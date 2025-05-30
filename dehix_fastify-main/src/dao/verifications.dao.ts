import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import {
  IVerification,
  VerificationModel,
} from "../models/verifications.entity";

@Service()
export class VerificationDAO extends BaseDAO {
  model: Model<IVerification>;

  constructor() {
    super();
    this.model = VerificationModel;
  }

  async createOne(
    verifier_id: string,
    verifier_username: string,
    requester_id: string,
    doc_id: string,
    doc_type: string,
  ) {
    return this.model.create({
      verifier_id,
      verifier_username,
      requester_id,
      document_id: doc_id,
      doc_type,
    });
  }

  async createOneBusiness(
    verifier_id: string,
    verifier_username: string,
    requester_id: string,
    doc_type,
  ) {
    return this.model.create({
      verifier_id,
      verifier_username,
      requester_id,
      doc_type,
    });
  }

  async getVerificationById(id: string) {
    return this.model
      .findById(
        id,
        "verifier_id requester_id document_id verification_status createdAt updatedAt",
      )
      .lean()
      .exec();
  }

  async updateVerification(condition: any, newData: any) {
    return this.model.updateOne(condition, newData).exec();
  }

  async findVerificationById(id: string) {
    return this.model.findById(id).lean().exec();
  }
  async findVerificationWithDocumentId(id: string) {
    return this.model.findOne({ document_id: id });
  }
  async updateVerificationData(id: string, update: any) {
    return this.model.updateOne({ _id: id }, update).exec();
  }

  async deleteVerification(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async updateStatus(verification_id: string, status: any) {
    return this.model.updateOne(
      { _id: verification_id },
      { $set: { verification_status: status } },
    );
  }

  async findVerificationByVerifierId(verifier_id: string) {
    return this.model.find({ verifier_id: verifier_id });
  }

  async findVerificationByRequesterId(requester_id: string) {
    return this.model.find({ requester_id: requester_id });
  }

  async findVerificationByDocumentId(document_id: string) {
    return this.model.findOne({ document_id: document_id });
  }

  async getVerificationData(
    verifier_id: string,
    doc_type:
      | "skill"
      | "domain"
      | "education"
      | "project"
      | "experience"
      | "business",
  ) {
    try {
      const query = {
        verifier_id: verifier_id,
        ...(doc_type && { doc_type }),
      };

      const verificationData = await this.model.find(query);

      if (doc_type == "business") {
        const requesterData = verificationData.map((doc: any) => ({
          requester_id: doc.requester_id,
        }));

        return requesterData;
      } else {
        const requesterData = verificationData.map((doc: any) => ({
          requester_id: doc.requester_id,
          document_id: doc.document_id,
        }));

        return requesterData;
      }
    } catch (error) {
      console.error("Error fetching verification requests data:", error);
      throw error;
    }
  }

  async getAllVerificationData(
    doc_type?:
      | "skill"
      | "domain"
      | "education"
      | "project"
      | "experience"
      | "business",
    type?: "FREELANCER" | "ADMIN",
  ) {
    try {
      const query = {
        ...(doc_type && { doc_type }),
        ...(type && { type }),
      };
      const verificationData = await this.model.find(query);

      if (doc_type == "business") {
        const data = verificationData.map((doc: any) => ({
          requester_id: doc.requester_id,
          verifier_id: doc.verifier_id,
          verifier_username: doc.verifier_username,
          doc_type: doc.doc_type,
          verification_status: doc.verification_status,
          verified_at: doc.verifiedAt,
          comment: doc.comment,
        }));

        return data;
      } else {
        const data = verificationData.map((doc: any) => ({
          verifier_id: doc.verifier_id,
          verifier_username: doc.verifier_username,
          requester_id: doc.requester_id,
          document_id: doc.document_id,
          doc_type: doc.doc_type,
          verification_status: doc.verification_status,
          verified_at: doc.verifiedAt,
          comment: doc.comment,
        }));

        return data;
      }
    } catch (error: any) {
      throw new Error(`Failed to fetch verification data: ${error.message}`);
    }
  }

  async findStaleVerifications() {
    const currentTime = new Date();
    const twoDaysAgo = new Date(currentTime.getTime() - 48 * 60 * 60 * 1000);

    const data = await this.model.find({
      verification_status: "Pending",
      updatedAt: { $lt: twoDaysAgo },
    });

    return data;
  }

  async reassignOracle(verificationId: string, newOracle: any) {
    const data = this.model.findByIdAndUpdate(
      verificationId,
      {
        verifier_id: newOracle.id,
        verifier_username: newOracle.username,
      },
      { new: true },
    );

    return data;
  }
  async getVerificationByVerifierId(
    verifier_id: string,
    doc_type?:
      | "skill"
      | "domain"
      | "education"
      | "project"
      | "experience"
      | "business",
  ) {
    const query = {
      verifier_id: verifier_id,
      ...(doc_type && { doc_type }),
    };
    return await this.model.find(query);
  }
  async updateVerificationById(
    _id: string,
    comment: string,
    verifiedAt: Date,
    verification_status: "PENDING" | "APPROVED" | "DENIED",
  ) {
    try {
      const updatedComment = await this.model.findOneAndUpdate(
        { _id },
        {
          comment: comment,
          verifiedAt: verifiedAt || new Date(),
          verification_status: verification_status,
        },
        { new: true },
      );

      return updatedComment;
    } catch (error: any) {
      throw new Error("Error updating comment: " + error.message);
    }
  }
}
