import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface IImageMeta {
  url: string;
  fileId?: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  uploadedAt?: Date;
  provider?: "imagekit" | "local";
}

export type EventStatus = "draft" | "published" | "scheduled" | "archived" | "upcoming" | "ongoing" | "past";

export interface IProgramEvent extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  shortDescription?: string;
  description: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  date: string; // Display date string e.g. "September 04, 2026"
  time: string; // Display time string e.g. "4:30 AM – 1:00 AM"
  timezone?: string;
  location: string;
  venue?: string;
  mapLink?: string;
  bannerUrl: string;
  bannerImageMeta?: IImageMeta;
  thumbnailUrl?: string;
  galleryImages?: string[];
  highlights?: string[];
  schedule?: IEventScheduleItem[];
  isFeatured: boolean;
  isPublished: boolean;
  status: EventStatus;
  order: number;
  contactNumber?: string;
  rsvpLink?: string;
  publishAt?: Date;
  unpublishAt?: Date;
  createdBy?: {
    id?: string;
    name?: string;
    email?: string;
  };
  updatedBy?: {
    id?: string;
    name?: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ProgramEventSchema: Schema = new Schema(
  {
    title: { type: String, required: [true, "Event title is required"], trim: true },
    slug: {
      type: String,
      required: [true, "Event slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    subtitle: { type: String, trim: true },
    category: {
      type: String,
      default: "Grand Festival",
      required: true,
      index: true,
      trim: true,
    },
    shortDescription: { type: String, trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    startDate: { type: String, trim: true },
    startTime: { type: String, trim: true },
    endDate: { type: String, trim: true },
    endTime: { type: String, trim: true },
    date: { type: String, required: [true, "Display date is required"], trim: true },
    time: { type: String, required: [true, "Display time is required"], trim: true },
    timezone: { type: String, default: "Asia/Kolkata (IST)" },
    location: { type: String, default: "Main Temple Hall, ISKCON Vartak Nagar, Thane", trim: true },
    venue: { type: String, trim: true },
    mapLink: { type: String, trim: true },
    bannerUrl: { type: String, required: [true, "Banner image URL is required"], trim: true },
    bannerImageMeta: {
      url: { type: String },
      fileId: { type: String },
      filename: { type: String },
      size: { type: Number },
      mimeType: { type: String },
      width: { type: Number },
      height: { type: Number },
      uploadedAt: { type: Date },
      provider: { type: String },
    },
    thumbnailUrl: { type: String, trim: true },
    galleryImages: [{ type: String, trim: true }],
    highlights: [{ type: String, trim: true }],
    schedule: [
      {
        time: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
      },
    ],
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived", "upcoming", "ongoing", "past"],
      default: "published",
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    contactNumber: { type: String, default: "+91 93228 81265", trim: true },
    rsvpLink: { type: String, default: "/support-us#donate", trim: true },
    publishAt: { type: Date },
    unpublishAt: { type: Date },
    createdBy: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
    },
    updatedBy: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true, collection: "ProgramEvents" }
);

// Compound indexes
ProgramEventSchema.index({ status: 1, isPublished: 1, order: 1, createdAt: -1 });
ProgramEventSchema.index({ isFeatured: 1, status: 1 });

const ProgramEvent: Model<IProgramEvent> =
  mongoose.models.ProgramEvent ||
  mongoose.model<IProgramEvent>("ProgramEvent", ProgramEventSchema, "ProgramEvents");

export default ProgramEvent;
