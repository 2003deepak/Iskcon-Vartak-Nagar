import mongoose, { Schema, Document, Model } from "mongoose";

export type MediaType = "IMAGE" | "YOUTUBE" | "INSTAGRAM_REEL";

export type MediaCategory =
  | "Darshan"
  | "Festival"
  | "Kirtan"
  | "Community Seva"
  | "Yatra"

export interface IMediaItem extends Document {
  title: string;
  description?: string;
  mediaType: MediaType;
  category: MediaCategory;
  imageUrl: string; // Primary / cover photo
  images?: string[]; // Up to 10 photos for the day/memory set
  externalUrl?: string;
  youtubeVideoId?: string;
  eventDate?: string; // Formatted YYYY-MM-DD
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
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

const MediaItemSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    mediaType: {
      type: String,
      enum: ["IMAGE", "YOUTUBE", "INSTAGRAM_REEL"],
      default: "IMAGE",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Darshan",
        "Festival",
        "Kirtan",
        "Community Seva",
        "Yatra",
        "Gaur Nitai",
        "Deities",
        "Spiritual",
        "Other",
      ],
      default: "Darshan",
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: [100, "Subcategory cannot exceed 100 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    externalUrl: {
      type: String,
      trim: true,
    },
    youtubeVideoId: {
      type: String,
      trim: true,
    },
    eventDate: {
      type: String,
      trim: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
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
  {
    timestamps: true,
    collection: "MediaItems",
  }
);

// Compound indexes for public queries and admin sorting
MediaItemSchema.index({ isPublished: 1, category: 1, displayOrder: 1, createdAt: -1 });
MediaItemSchema.index({ isPublished: 1, isFeatured: 1, displayOrder: 1 });
MediaItemSchema.index({ eventDate: -1, createdAt: -1 });

const MediaItem: Model<IMediaItem> =
  mongoose.models.MediaItem ||
  mongoose.model<IMediaItem>("MediaItem", MediaItemSchema, "MediaItems");

export default MediaItem;
