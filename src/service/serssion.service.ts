import { FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { Request, Response, NextFunction } from "express";

export async function createSession(
  userId: ObjectId,
  userAgent: string,
  ip: string
) {
  const session = await SessionModel.create({ user: userId, userAgent, ip });
  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return await SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return await SessionModel.updateOne(query, update);
}
