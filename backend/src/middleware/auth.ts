import { Request, Response, NextFunction } from "express";
import { verify } from "../lib/jwt";

export function requireAuth(req: Request & { tenantId?: string }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = verify(token);
    req.tenantId = payload.tenantId;
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid token" });
  }
}
