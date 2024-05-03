import { NextFunction, Request, Response } from "express";

export function captureIp(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  req.body.ip = ip;
  next();
}
