import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Movie } from "@/lib/models";

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

function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export async function GET() {
  const col = await getCollection<Movie>("movies");
  const items = await col.find({}).sort({ createdAt: -1 }).toArray();
  const mapped = items.map(({ _id, ...rest }) => ({
    _id: _id?.toString?.() ?? _id,
    ...rest,
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    genre, // comma separated string from UI
    durationMinutes,
    poster,
    thumbnail,
    trailer,
    description,
    status,
    schedule,
  } = body || {};

  if (!title || !poster || !trailer || !description || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const minutes = Number(durationMinutes);
  if (Number.isNaN(minutes) || minutes <= 0) {
    return NextResponse.json(
      { error: "durationMinutes must be a positive number" },
      { status: 400 }
    );
  }

  const genres: string[] = String(genre || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const doc: Movie = {
    title: String(title),
    genres,
    durationMinutes: minutes,
    durationLabel: minutesToLabel(minutes),
    poster: String(poster),
    ...(thumbnail ? { thumbnail: String(thumbnail) } : {}),
    trailer: normalizeYouTubeEmbed(String(trailer)),
    description: String(description),
    status: status === "now-showing" ? "now-showing" : "upcoming",
    isActive: true,
    schedule: schedule && typeof schedule === "object" ? schedule : {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const col = await getCollection<Movie>("movies");
  const res = await col.insertOne(doc);
  return NextResponse.json(
    { _id: res.insertedId.toString(), ...doc },
    { status: 201 }
  );
}
