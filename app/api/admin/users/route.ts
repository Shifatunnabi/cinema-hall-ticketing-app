import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { User } from "@/lib/models";
import { getAuth } from "@/app/api/admin/_auth";

export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await getCollection<User>("users");
  const list = await users
    .find(
      {},
      {
        projection: {
          passwordHash: 0,
          inviteToken: 0,
          inviteTokenExpiresAt: 0,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ users: list });
}

export async function DELETE(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth || auth.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const users = await getCollection<User>("users");
  await users.deleteOne({
    _id: new (await import("mongodb")).ObjectId(id),
  } as any);
  return NextResponse.json({ ok: true });
}
