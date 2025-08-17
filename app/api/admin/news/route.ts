import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { News } from "@/lib/models";

// GET /api/admin/news - Fetch all news for admin (including inactive)
export async function GET() {
  try {
    const newsCollection = await getCollection<News>("news");
    
    // Fetch all news for admin, sorted by creation date (newest first)
    const news = await newsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Error fetching admin news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
