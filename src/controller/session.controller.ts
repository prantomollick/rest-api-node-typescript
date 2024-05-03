import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession } from "../service/serssion.service";

export async function createUserSessionHandler(req: Request, res: Response) {
  //validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // create a session
  const session = createSession(
    user._id,
    req.get("user-agent") || "",
    req.body.ip
  );

  // create an access token
  // create a refresh token
  //return access & refresh token
}
