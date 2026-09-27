import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import MediaItem from "@/models/MediaItem";

export const dynamic = "force-dynamic";

/**
 * GET /api/media
 * Public API for fetching published media items (Images, YouTube videos, Instagram Reels).
 * Supports filters: category, type, featured, date, search, limit.
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const date = searchParams.get("date");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // Only return published media to the public
    const query: Record<string, any> = { isPublished: true };

    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (type && type.toLowerCase() !== "all") {
      query.mediaType = type.toUpperCase().trim();
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (date && date.trim().length > 0) {
      query.eventDate = date.trim();
    }

    if (search && search.trim().length > 0) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: new RegExp(sanitized, "i") },
        { description: new RegExp(sanitized, "i") },
        { subcategory: new RegExp(sanitized, "i") },
      ];
    }

    const items = await MediaItem.find(query)
      .sort({ displayOrder: 1, eventDate: -1, createdAt: -1 })
      .limit(Math.min(limit, 200))
      .lean();

    return NextResponse.json({
      success: true,
      count: items.length,
      items: items.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        description: item.description || "",
        mediaType: item.mediaType,
        category: item.category,
        subcategory: item.subcategory || "",
        imageUrl: item.imageUrl,
        externalUrl: item.externalUrl || null,
        youtubeVideoId: item.youtubeVideoId || null,
        eventDate: item.eventDate || "",
        isFeatured: Boolean(item.isFeatured),
        isPublished: Boolean(item.isPublished),
        displayOrder: item.displayOrder || 0,
        createdAt: item.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("[Public Media GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve media items" },
      { status: 500 }
    );
  }
}
