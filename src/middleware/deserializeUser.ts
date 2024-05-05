import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/serssion.service";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh", "") as string;

  if (!accessToken || typeof accessToken !== "string") {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const token = await reIssueAccessToken({
      refreshToken
    });
    if (token) {
      const result = verifyJwt(token.newAccessToken);
      res.locals.user = result.decoded;
      res.setHeader("x-access-token", token.newAccessToken);
      res.setHeader("x-refresh", token.newRefreshToken);
      return next();
    }
  }

  return next();
}
