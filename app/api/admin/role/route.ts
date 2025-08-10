import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { User, Role } from "@/lib/models";
import jwt from "jsonwebtoken";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const secret = process.env.JWT_SECRET as string;
  if (!token || !secret) return null;
  try {
    const payload = jwt.verify(token, secret) as any;
    if (payload.role !== "admin") return null;
    return payload as { _id: string; email: string; role: "admin" };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, role } = (await req.json()) as { id: string; role: Role };
  if (!id || !["admin", "moderator"].includes(role))
    return NextResponse.json({ error: "Bad input" }, { status: 400 });

  const users = await getCollection<User>("users");
  await users.updateOne(
    { _id: new (await import("mongodb")).ObjectId(id) } as any,
    { $set: { role } }
  );
  return NextResponse.json({ ok: true });
}
