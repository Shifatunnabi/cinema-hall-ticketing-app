import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { comparePassword } from "@/lib/auth";
import type { User } from "@/lib/models";
import { signAuthToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const users = await getCollection<User>("users");
    const user = await users.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = signAuthToken({
      _id: String(user._id),
      role: user.role,
      email: user.email,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
