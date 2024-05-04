import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.headers);

  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  console.log("Access token:", accessToken);

  if (!accessToken || typeof accessToken !== "string") {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);
  console.log(decoded);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  return next();
}
