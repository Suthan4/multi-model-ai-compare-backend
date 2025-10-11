import mongoose, { Schema, Document } from "mongoose";
import { AIProvider, ComparisonStatus } from "../constants/models";

export interface IModelResponse {
  model: string;
  provider: AIProvider;
  response: string;
  tokenCount: number;
  responseTime: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface IComparison extends Document {
  prompt: string;
  models: string[];
  responses: IModelResponse[];
  status: ComparisonStatus;
  shareId?: string;
  isPublic: boolean;
  createdBy?: string;
  totalResponseTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const modelResponseSchema = new Schema<IModelResponse>(
  {
    model: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["groq", "openai", "anthropic"],
    },
    response: {
      type: String,
      required: true,
    },
    tokenCount: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    error: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const comparisonSchema = new Schema<IComparison>(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    models: [
      {
        type: String,
        required: true,
      },
    ],
    responses: [modelResponseSchema],
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
    },
    totalResponseTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes - shareId already has unique:true which creates index
comparisonSchema.index({ createdAt: -1 });
comparisonSchema.index({ createdBy: 1, createdAt: -1 });

// Transform _id to id in JSON responses
comparisonSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

export const Comparison = mongoose.model<IComparison>(
  "Comparison",
  comparisonSchema
);
