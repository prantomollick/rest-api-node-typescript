import { NextFunction, Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import {
  createSession,
  findSessions,
  updateSession
} from "../service/serssion.service";
import config from "config";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  //validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // create a session
  const session = await createSession(
    user._id,
    req.get("user-agent") || "",
    req.body.ip
  );

  // create an access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id
    },
    {
      expiresIn: config.get("accessTokenTtl") // 15 minutes
    }
  );

  // create a refresh token
  const refreshToken = signJwt(
    {
      ...user,
      session: session._id
    },
    {
      expiresIn: config.get("refreshTokenTtl") // 15 minutes
    }
  );

  //return access & refresh token

  return res.json({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.user._id;

  const session = await findSessions({ user: userId, valid: true });

  return res.json(session);
}

export async function deleteSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { $set: { valid: false } });

  return res.json({
    accessToken: null,
    refreshToken: null
  });
}
