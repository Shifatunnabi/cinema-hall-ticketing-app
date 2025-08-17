import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { News } from "@/lib/models";
import { ObjectId } from "mongodb";

// GET /api/news - Fetch all active news
export async function GET() {
  try {
    const newsCollection = await getCollection<News>("news");
    
    // Fetch all active news, sorted by creation date (newest first)
    const news = await newsCollection
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// POST /api/news - Create new news (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, link, featured } = body;

    // Basic validation
    if (!title || !description || !image) {
      return NextResponse.json(
        { error: "Title, description, and image are required" },
        { status: 400 }
      );
    }

    const newsCollection = await getCollection<News>("news");

    // Create new news item
    const newNews: Omit<News, "_id"> = {
      title,
      description,
      image,
      link: link || "",
      featured: featured || false,
      isActive: true,
      author: "Cinema Management",
      category: "Cinema Updates",
      views: 0,
      readTime: "3 min read",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await newsCollection.insertOne(newNews);

    // Return the created news with the generated ID
    const createdNews = {
      _id: result.insertedId,
      ...newNews,
    };

    return NextResponse.json({ 
      success: true, 
      news: createdNews,
      message: "News created successfully" 
    });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
