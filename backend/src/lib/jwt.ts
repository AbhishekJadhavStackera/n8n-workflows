import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "devsecret";

export function sign(payload: object, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: "8h", ...(opts as any) });
}

export function verify(token: string) {
  return jwt.verify(token, SECRET) as any;
}

export function decode(token: string) {
  return jwt.decode(token);
}