import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const secret = process.env.JWT_SECRET as string | undefined;
  if (!token || !secret) return NextResponse.json({ role: null });
  try {
    const payload = jwt.verify(token, secret) as any;
    return NextResponse.json({ role: payload.role });
  } catch {
    return NextResponse.json({ role: null });
  }
}
