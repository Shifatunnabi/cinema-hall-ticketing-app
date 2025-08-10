import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCollection } from "@/lib/db";
import type { User } from "@/lib/models";
import { sendInviteEmail } from "@/lib/mail";
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

  const { email, role } = await req.json();
  if (!email || !["admin", "moderator"].includes(role)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const users = await getCollection<User>("users");
  const existing = await users.findOne({ email: email.toLowerCase() });
  if (existing && existing.isActive) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days
  const now = new Date();

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          inviteToken: tokenHash,
          inviteTokenExpiresAt: expires,
          role,
          updatedAt: now,
        },
      }
    );
  } else {
    await users.insertOne({
      email: email.toLowerCase(),
      role,
      isActive: false,
      inviteToken: tokenHash,
      inviteTokenExpiresAt: expires,
      createdAt: now,
      updatedAt: now,
      invitedBy: new (await import("mongodb")).ObjectId(auth._id) as any,
    } as any);
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${base}/admin/activate?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(email)}`;
  await sendInviteEmail(email, link, role);

  return NextResponse.json({ ok: true });
}
