import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
    ip: { type: String },
    // expiresAt: { type: Date, default: () => Date.now() + 86400000 }
    expiresAt: { type: Date, default: () => Date.now() + 60000 }
  },
  {
    timestamps: true
  }
);

//Indexes to automatically delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionModel = mongoose.model("Session", SessionSchema);

export default SessionModel;
