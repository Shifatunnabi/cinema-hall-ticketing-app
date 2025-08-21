import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Movie } from "@/lib/models";
import { ObjectId } from "mongodb";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const col = await getCollection<Movie>("movies");
    const res = await col.deleteOne({ _id: new ObjectId(id) });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function normalizeYouTubeEmbed(url: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (u.pathname.startsWith("/embed/"))
      return `https://www.youtube.com${u.pathname}`;
    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
  } catch {}
  return url;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const update: Partial<Movie> = {};

    if (body.title !== undefined) update.title = String(body.title);

    if (body.genre !== undefined) {
      const genres: string[] = String(body.genre || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      (update as any).genres = genres;
    }

    if (body.durationMinutes !== undefined) {
      const minutes = Number(body.durationMinutes);
      if (Number.isNaN(minutes) || minutes <= 0) {
        return NextResponse.json(
          { error: "durationMinutes must be a positive number" },
          { status: 400 }
        );
      }
      (update as any).durationMinutes = minutes;
      (update as any).durationLabel = minutesToLabel(minutes);
    }

    if (body.poster !== undefined) update.poster = String(body.poster);
    if (body.thumbnail !== undefined)
      (update as any).thumbnail = body.thumbnail
        ? String(body.thumbnail)
        : undefined;
    if (body.trailer !== undefined)
      update.trailer = normalizeYouTubeEmbed(String(body.trailer));
    if (body.description !== undefined)
      update.description = String(body.description);

    if (body.status !== undefined) {
      update.status =
        body.status === "now-showing" ? "now-showing" : "upcoming";
    }

    if (body.schedule !== undefined && typeof body.schedule === "object") {
      update.schedule = body.schedule;
    }

    if (body.isActive !== undefined) {
      update.isActive = Boolean(body.isActive);
    }

    (update as any).updatedAt = new Date();

    const col = await getCollection<Movie>("movies");
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    const doc = (result as any)?.value || (result as any);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { _id, ...rest } = doc;
    return NextResponse.json({ _id: _id?.toString?.() ?? _id, ...rest });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
