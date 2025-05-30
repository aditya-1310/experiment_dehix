import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Enums
export enum MilestoneStatus {
  NOT_STARTED = "NOT_STARTED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export interface TaskRequestParams {
  milestoneId: string;
  storyId: string;
  taskId: string;
}

export interface TaskRequestBody {
  title: string;
  summary: string;
  taskStatus: MilestoneStatus;
}

export interface TaskUpdateBody {
  updatePermissionFreelancer: boolean;
  updatePermissionBusiness: boolean;
  acceptanceBusiness: boolean;
  acceptanceFreelancer: boolean;
}

export interface TaskRequest {
  params: TaskRequestParams;
  body: TaskRequestBody;
}

interface ITask {
  _id: string;
  summary: string;
  title: string;
  taskStatus: MilestoneStatus;
  freelancers?: {
    freelancerId: string;
    freelancerName: string;
    cost: number;
    paymentStatus: PaymentStatus;
    transactionId?: string;
    startDate?: Date;
    endDate?: Date;
    updatePermissionFreelancer: boolean;
    updatePermissionBusiness: boolean;
    acceptanceFreelancer: boolean;
    acceptanceBusiness: boolean;
  }[];
}

interface IStories {
  _id: string;
  summary: string;
  importantUrls?: { urlName: string; url: string }[];
  title: string;
  storyStatus: MilestoneStatus;
  tasks?: ITask[];
  createdAt?: Date;
}

interface IPayment {
  amount: number;
  status: PaymentStatus;
}

export interface IMilestone extends Document {
  _id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string;
  startDate: {
    expected: Date;
    actual?: Date;
  };
  endDate: {
    expected: Date;
    actual?: Date;
  };
  amount?: number;
  stories?: IStories[];
  payment: IPayment;
  status: MilestoneStatus;
}

// Task Schema
const TaskSchema: Schema<ITask> = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  summary: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  taskStatus: {
    type: String,
    enum: Object.values(MilestoneStatus),
    default: MilestoneStatus.NOT_STARTED,
  },
  freelancers: [
    {
      freelancerId: { type: String, required: true },
      freelancerName: { type: String, required: true },
      cost: { type: Number, required: true },
      paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },
      transactionId: { type: String },
      startDate: {
        expected: {
          type: Date,
          required: true,
        },
        actual: {
          type: Date,
        },
      },
      endDate: {
        expected: {
          type: Date,
          required: true,
        },
        actual: {
          type: Date,
        },
      },
      updatePermissionFreelancer: { type: Boolean, default: false },
      updatePermissionBusiness: { type: Boolean, default: false },
      acceptanceFreelancer: { type: Boolean, default: false },
      acceptanceBusiness: { type: Boolean, default: false },
    },
  ],
});

// Stories Schema
const StoriesSchema: Schema<IStories> = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    summary: {
      type: String,
      required: true,
    },
    importantUrls: {
      type: [
        {
          urlName: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    storyStatus: {
      type: String,
      enum: Object.values(MilestoneStatus),
      default: MilestoneStatus.NOT_STARTED,
    },
    tasks: {
      type: [TaskSchema], // Embed the TaskSchema here
    },
  },
  { timestamps: true },
);

// Payment Schema
const PaymentSchema: Schema<IPayment> = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },
});

// Milestone Schema
const MilestoneSchema: Schema<IMilestone> = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    startDate: {
      expected: {
        type: Date,
        required: true,
      },
      actual: {
        type: Date,
      },
    },
    endDate: {
      expected: {
        type: Date,
        required: true,
      },
      actual: {
        type: Date,
      },
    },
    amount: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MilestoneStatus),
      default: MilestoneStatus.NOT_STARTED,
    },
    stories: {
      type: [StoriesSchema],
    },
    payment: {
      type: PaymentSchema,
    },
  },
  { timestamps: true },
);

// Compile and export the model
const Milestone: Model<IMilestone> = mongoose.model<IMilestone>(
  "Milestone",
  MilestoneSchema,
);

export default Milestone;
