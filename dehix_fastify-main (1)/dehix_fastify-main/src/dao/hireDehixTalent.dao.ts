import { v4 as uuidv4 } from "uuid";
import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { HireModel, IHire } from "../models/hireDehixTalent.entity";
import { AddDehixTalentInLobbyBody } from "../types/v1/hireDehixTalent/addFreelancerIntoLobby";
import { AddDehixTalentInInvitedBody } from "src/types/v1/hireDehixTalent/updateHireDehixTalent";

@Service()
export class HireDAO extends BaseDAO {
  model: Model<IHire>;

  constructor() {
    super();
    this.model = HireModel;
  }

  async findHireDehixTalentById(id: string) {
    return this.model.findById(id);
  }

  async createHireDehixTalent(data: any) {
    return this.model.create(data);
  }

  async updateHireDehixTalent(hireDehixTalent_id: any, newData: any) {
    return this.model.findByIdAndUpdate({ _id: hireDehixTalent_id }, newData, {
      new: true,
    });
  }

  async deleteHireDehixTalentById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async getHireDehixTalent(business_id: string) {
    try {
      // Query the HireModel for all records that match the business_id
      const hires = await this.model.find({ businessId: business_id });
      return hires;
    } catch (error) {
      console.error("Error in getHireByBusinessId:", error);
      throw new Error("Could not retrieve Hire records");
    }
  }

  async updateStatusHireDehixTalent(
    business_id: string,
    hireDehixTalent_id: string,
    update: { status?: string; visible?: boolean },
  ) {
    // Use the $set operator to only update the specific fields
    const updateFields = {} as any;

    if (update.status !== undefined) {
      updateFields[`status`] = update.status;
    }
    if (update.visible !== undefined) {
      updateFields[`visible`] = update.visible;
    }
    console.log(updateFields);
    // Perform the update with only the necessary fields
    try {
      const data = this.model.findOneAndUpdate(
        {
          _id: hireDehixTalent_id,
        },
        { $set: updateFields },
        {
          new: true, // Return the updated document
        },
      );
      return data;
    } catch (error) {
      console.error("Error in updateStatusHireDehixTalent:", error);
      throw new Error("Could not update Hire records");
    }
  }

  async updateStatusHireDehixTalentBookmarked(
    hireDehixTalent_id: string,
    update: { bookmarked: boolean },
  ) {
    // Perform the update with only the necessary fields
    try {
      const data = await this.model.findOneAndUpdate(
        { _id: hireDehixTalent_id },
        { $set: update },
        { new: true }, // Return the updated document
      );
      return data;
    } catch (error) {
      console.error("Error in updateStatusHireDehixTalent:", error);
      throw new Error("Could not update Hire records");
    }
  }

  async addDehixTalentIntoLobby(
    hireDehixTalent_id: string,
    data: AddDehixTalentInLobbyBody,
  ) {
    try {
      const updates = data.dehixTalentId.map((id) => ({
        _id: uuidv4(),
        freelancerId: data.freelancerId,
        dehixTalentId: id,
      }));

      const response = await this.model.findByIdAndUpdate(
        hireDehixTalent_id,
        {
          $push: {
            freelancerInLobby: { $each: updates },
          },
        },
        { new: true },
      );

      return response;
    } catch (error: any) {
      console.error(`Error in addDehixTalentIntoLobby: ${error.message}`);
      throw new Error("Could not add dehix talent(s) in lobby");
    }
  }

  async inviteDehixTalent(
    hireDehixTalent_id: string,
    data: AddDehixTalentInInvitedBody,
  ) {
    const inviteId = uuidv4();
    try {
      const response = await this.model.findByIdAndUpdate(
        hireDehixTalent_id,
        {
          $push: {
            freelancerInvited: {
              _id: inviteId,
              ...data,
            },
          },
        },
        { new: true }, // return the updated document
      );

      return response;
    } catch (error: any) {
      console.error(`Error in addDehixTalentIntoLobby: ${error.message}`);
      throw new Error("Could not add dehix talent in lobby");
    }
  }

  async selectDehixTalent(
    hireDehixTalent_id: string,
    data: AddDehixTalentInLobbyBody,
  ) {
    const selectionId = uuidv4();
    try {
      const response = await this.model.findByIdAndUpdate(
        hireDehixTalent_id,
        {
          $push: {
            freelancerSelected: {
              _id: selectionId,
              ...data,
            },
          },
        },
        { new: true }, // return the updated document
      );

      return response;
    } catch (error: any) {
      console.error(`Error in addDehixTalentIntoLobby: ${error.message}`);
      throw new Error("Could not add dehix talent in lobby");
    }
  }

  async rejectDehixTalent(
    hireDehixTalent_id: string,
    data: AddDehixTalentInLobbyBody,
  ) {
    const rejectionId = uuidv4();
    try {
      const response = await this.model.findByIdAndUpdate(
        hireDehixTalent_id,
        {
          $push: {
            freelancerRejected: {
              _id: rejectionId,
              ...data,
            },
          },
        },
        { new: true }, // return the updated document
      );

      return response;
    } catch (error: any) {
      console.error(`Error in addDehixTalentIntoLobby: ${error.message}`);
      throw new Error("Could not add dehix talent in lobby");
    }
  }

  async getDehixTalentInLobby(hireDehixTalent_id: string) {
    try {
      const response = await this.model.findById(hireDehixTalent_id, {
        freelancerInLobby: 1,
      });

      return response;
    } catch (error: any) {
      console.error(`Error in getDehixTalentInLobby: ${error.message}`);
      throw new Error("Could not get dehix talent in lobby");
    }
  }

  async getInvitedDehixTalent(hireDehixTalent_id: string) {
    try {
      const response = await this.model.findById(hireDehixTalent_id, {
        freelancerInvited: 1,
      });

      return response;
    } catch (error: any) {
      console.error(`Error in h: ${error.message}`);
      throw new Error("Could not get dehix talent in lobby");
    }
  }

  async getSelectedDehixTalent(hireDehixTalent_id: string) {
    try {
      const response = await this.model.findById(hireDehixTalent_id, {
        freelancerSelected: 1,
      });

      return response;
    } catch (error: any) {
      console.error(`Error in getSelectedDehixTalent: ${error.message}`);
      throw new Error("Could not get selected dehix talent");
    }
  }

  async getRejectedDehixTalent(hireDehixTalent_id: string) {
    try {
      const response = await this.model.findById(hireDehixTalent_id, {
        freelancerRejected: 1,
      });

      return response;
    } catch (error: any) {
      console.error(`Error in addDehixTalentIntoLobby: ${error.message}`);
      throw new Error("Could not get rejected dehix talent");
    }
  }
}
