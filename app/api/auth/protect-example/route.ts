import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const secret = process.env.JWT_SECRET as string | undefined;
  if (!token || !secret)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = jwt.verify(token, secret) as any;
    return NextResponse.json({ ok: true, user: payload });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
