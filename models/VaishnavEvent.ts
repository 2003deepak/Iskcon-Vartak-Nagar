import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParanaDetails {
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface IVaishnavEvent extends Document {
  dateString: string; // YYYY-MM-DD format
  year: number;
  title: string;
  category?: string;
  color?: string;
  isFast?: boolean;
  location?: string;
  paranaDetails?: IParanaDetails | null;
  date?: Date;
  createdAt?: Date;
}

const VaishnavEventSchema: Schema = new Schema(
  {
    dateString: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String },
    color: { type: String },
    isFast: { type: Boolean, default: false },
    location: { type: String, default: "Mumbai, India" },
    paranaDetails: {
      date: { type: String },
      startTime: { type: String },
      endTime: { type: String },
    },
    date: { type: Date },
  },
  { timestamps: true, collection: "Events" }
);

const VaishnavEvent: Model<IVaishnavEvent> =
  mongoose.models.VaishnavEvent ||
  mongoose.model<IVaishnavEvent>("VaishnavEvent", VaishnavEventSchema, "Events");

export default VaishnavEvent;
