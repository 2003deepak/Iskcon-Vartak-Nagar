import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParanaDetails {
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface IVaishnavEvent extends Document {
  dateString: string; // YYYY-MM-DD format (e.g. "2026-03-03")
  year: number; // e.g. 2026
  title: string;
  category?: string; // controlled: 'festival' | 'ekadashi' | 'mahadvadasi' | 'appearance' | 'disappearance' | 'fast' | 'special'
  color?: string; // hex color code e.g. "#7c3aed"
  isFast?: boolean;
  location?: string;
  paranaDetails?: IParanaDetails | null;
  date?: Date; // ISODate representation
  createdAt?: Date;
  updatedAt?: Date;
}

const VaishnavEventSchema: Schema = new Schema(
  {
    dateString: {
      type: String,
      required: [true, "Date string (YYYY-MM-DD) is required"],
      index: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date string must be in YYYY-MM-DD format"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "festival",
      index: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#d97706",
      trim: true,
    },
    isFast: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "Mumbai, India",
      trim: true,
    },
    paranaDetails: {
      date: { type: String, trim: true },
      startTime: { type: String, trim: true },
      endTime: { type: String, trim: true },
    },
    date: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "Events",
  }
);

// Compound index to facilitate fast queries by year and date
VaishnavEventSchema.index({ year: 1, dateString: 1 });
VaishnavEventSchema.index({ dateString: 1, title: 1, location: 1 });

const VaishnavEvent: Model<IVaishnavEvent> =
  mongoose.models.VaishnavEvent ||
  mongoose.model<IVaishnavEvent>("VaishnavEvent", VaishnavEventSchema, "Events");

export default VaishnavEvent;
