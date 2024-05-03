import { ObjectId } from "mongoose";
import SessionModel from "../models/session.model";

export async function createSession(
  userId: ObjectId,
  userAgent: string,
  ip: string
) {
  const session = await SessionModel.create({ user: userId, userAgent, ip });
  return session.toJSON();
}
