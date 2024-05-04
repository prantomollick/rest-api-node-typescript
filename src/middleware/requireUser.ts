import { Request, Response, NextFunction } from "express";

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user;

  if (!user) {
    // Log the error for internal tracking
    console.error("Access denied: No user session found.");

    // Respond with a 403 Forbidden error message
    return res.status(403).json({
      error: "Access Denied",
      message: "You do not have permission to access the requested resource.",
      nextSteps: [
        "Check if you are logged in to the correct account.",
        "If you believe this is an error, please contact support.",
        "Return to the homepage or try again later."
      ]
    });
  }

  return next();
}
