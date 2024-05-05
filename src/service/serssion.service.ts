import { FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { Request, Response, NextFunction } from "express";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";
import config from "config";

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

export async function reIssueAccessToken({
  refreshToken
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);
  console.log("reDecoded", decoded);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  // create an access token
  const newAccessToken = signJwt(
    {
      ...user,
      session: session._id
    },
    {
      expiresIn: config.get("accessTokenTtl") // 15 minutes
    }
  );

  // create a refresh token
  const newRefreshToken = signJwt(
    {
      ...user,
      session: session._id
    },
    {
      expiresIn: config.get("refreshTokenTtl") // 15 minutes
    }
  );

  return { newAccessToken, newRefreshToken };
}
