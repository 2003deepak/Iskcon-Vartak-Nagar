import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  action:
    | "CREATE_EVENT"
    | "UPDATE_EVENT"
    | "PUBLISH_EVENT"
    | "UNPUBLISH_EVENT"
    | "DELETE_EVENT"
    | "UPLOAD_IMAGE"
    | "CALENDAR_CREATE"
    | "CALENDAR_UPDATE"
    | "CALENDAR_DELETE"
    | "ADMIN_LOGIN"
    | "ADMIN_LOGOUT";
  entityType: "Event" | "Calendar" | "Media" | "User" | "Auth";
  entityId?: string;
  entityTitle?: string;
  performedBy: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      index: true,
    },
    entityTitle: {
      type: String,
    },
    performedBy: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
      role: { type: String },
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "AuditLogs",
  }
);

AuditLogSchema.index({ createdAt: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema, "AuditLogs");

export default AuditLog;
