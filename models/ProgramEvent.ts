import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface IProgramEvent extends Document {
  title: string;
  subtitle?: string;
  category: "Grand Festival" | "Weekly Program" | "Youth & Kids" | "Kirtan & Seva" | "Spiritual Seminar";
  date: string;
  time: string;
  location: string;
  bannerUrl: string;
  description: string;
  highlights?: string[];
  schedule?: IEventScheduleItem[];
  isFeatured?: boolean;
  contactNumber?: string;
  rsvpLink?: string;
  status?: "upcoming" | "ongoing" | "past";
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProgramEventSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Grand Festival", "Weekly Program", "Youth & Kids", "Kirtan & Seva", "Spiritual Seminar"],
      default: "Grand Festival",
      required: true,
      index: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, default: "Main Temple Hall, ISKCON Vartak Nagar, Thane" },
    bannerUrl: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    schedule: [
      {
        time: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false, index: true },
    contactNumber: { type: String, default: "+91 93228 81265" },
    rsvpLink: { type: String },
    status: { type: String, enum: ["upcoming", "ongoing", "past"], default: "upcoming", index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "ProgramEvents" }
);

const ProgramEvent: Model<IProgramEvent> =
  mongoose.models.ProgramEvent ||
  mongoose.model<IProgramEvent>("ProgramEvent", ProgramEventSchema, "ProgramEvents");

export default ProgramEvent;
