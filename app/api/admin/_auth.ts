import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export type AuthPayload = {
  _id: string;
  email: string;
  role: "admin" | "moderator";
};

export function getAuth(req: NextRequest): AuthPayload | null {
  const token = req.cookies.get("admin_token")?.value;
  const secret = process.env.JWT_SECRET as string | undefined;
  if (!token || !secret) return null;
  try {
    return jwt.verify(token, secret) as any;
  } catch {
    return null;
  }
}

export function requireAdmin(req: NextRequest): AuthPayload | null {
  const auth = getAuth(req);
  if (!auth || auth.role !== "admin") return null;
  return auth;
}
