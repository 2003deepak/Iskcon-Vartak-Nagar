import mongoose, { Schema, Document, Model } from "mongoose";

export type ContactMethod = "WhatsApp" | "Phone Call" | "Email";

export interface IVolunteerApplication extends Document {
  applicationNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  sevaInterest: string;
  preferredContactMethod: ContactMethod;
  availability?: string;
  adminNotes?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerApplicationSchema: Schema = new Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [150, "Full name cannot exceed 150 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters"],
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
    },
    sevaInterest: {
      type: String,
      required: [true, "Seva interest is required"],
      trim: true,
      maxlength: [120, "Seva interest cannot exceed 120 characters"],
      index: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ["WhatsApp", "Phone Call", "Email"],
      default: "WhatsApp",
    },
    availability: {
      type: String,
      trim: true,
      default: "Flexible / Weekends",
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [3000, "Notes cannot exceed 3000 characters"],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "VolunteerApplications",
  }
);

VolunteerApplicationSchema.index({ sevaInterest: 1, submittedAt: -1 });

const VolunteerApplication: Model<IVolunteerApplication> =
  mongoose.models.VolunteerApplication ||
  mongoose.model<IVolunteerApplication>(
    "VolunteerApplication",
    VolunteerApplicationSchema,
    "VolunteerApplications"
  );

export default VolunteerApplication;
