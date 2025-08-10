import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { User } from "@/lib/models";
import { hashPassword } from "@/lib/auth";

// Simple seed endpoint to create the first admin if none exists.
export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { error: "Missing email/password" },
        { status: 400 }
      );

    const users = await getCollection<User>("users");
    const existingAdmin = await users.findOne({
      role: "admin",
      isActive: true,
    });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();
    const res = await users.insertOne({
      email: email.toLowerCase(),
      name: name || email.split("@")[0],
      role: "admin",
      passwordHash,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    } as any);

    return NextResponse.json({ ok: true, id: res.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
