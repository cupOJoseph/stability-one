import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include session userId
declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

/**
 * Middleware to check if user is authenticated via session
 */
export function authenticateSession(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

/**
 * Middleware to check Capital One API token validity
 * This would be used in routes that require fresh token validation
 */
export function validateCapitalOneToken(req: Request, res: Response, next: NextFunction) {
  // Implementation would depend on how tokens are stored and validated
  // This is a placeholder for the actual implementation
  next();
}
