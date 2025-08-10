import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { User } from "@/lib/models";
import crypto from "crypto";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, token, password, name } = await req.json();
    if (!email || !token || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const users = await getCollection<User>("users");
    const user = await users.findOne({
      email: email.toLowerCase(),
      inviteToken: hashed,
    });
    if (
      !user ||
      !user.inviteTokenExpiresAt ||
      user.inviteTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          name: name || user.name || email.split("@")[0],
          passwordHash,
          isActive: true,
          updatedAt: new Date(),
        },
        $unset: { inviteToken: "", inviteTokenExpiresAt: "" },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
