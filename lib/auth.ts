import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string | undefined;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(payload: {
  _id: string;
  role: "admin" | "moderator";
  email: string;
}) {
  if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in env");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(
  token: string
): { _id: string; role: "admin" | "moderator"; email: string } | null {
  try {
    if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in env");
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}
