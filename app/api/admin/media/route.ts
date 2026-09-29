import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import MediaItem, { MediaType, MediaCategory } from "@/models/MediaItem";
import { getAuthenticatedAdmin } from "@/lib/auth";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  isValidHttpUrl,
  isValidInstagramUrl,
  fetchInstagramPreview,
} from "@/lib/media-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/media
 * Admin media listing with filters (search, type, category, status, featured, date, sorting) + stats.
 */
export async function GET(request: NextRequest) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const date = searchParams.get("date");
    const sortBy = searchParams.get("sortBy") || "displayOrder";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;

    const query: Record<string, any> = {};

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (type && type !== "all") {
      query.mediaType = type.toUpperCase().trim();
    }

    if (status && status !== "all") {
      query.isPublished = status === "published";
    }

    if (featured && featured !== "all") {
      query.isFeatured = featured === "true";
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
        { externalUrl: new RegExp(sanitized, "i") },
      ];
    }

    // Build sort
    let sortObj: Record<string, any> = {};
    if (sortBy === "displayOrder") {
      sortObj = { displayOrder: 1, eventDate: -1, createdAt: -1 };
    } else if (sortBy === "eventDate") {
      sortObj = { eventDate: sortOrder, createdAt: -1 };
    } else if (sortBy === "createdAt") {
      sortObj = { createdAt: sortOrder };
    } else {
      sortObj = { [sortBy]: sortOrder };
    }

    const [items, totalCount, publishedCount, draftCount, featuredCount, imageCount, videoCount, reelCount] =
      await Promise.all([
        MediaItem.find(query).sort(sortObj).lean(),
        MediaItem.countDocuments(),
        MediaItem.countDocuments({ isPublished: true }),
        MediaItem.countDocuments({ isPublished: false }),
        MediaItem.countDocuments({ isFeatured: true }),
        MediaItem.countDocuments({ mediaType: "IMAGE" }),
        MediaItem.countDocuments({ mediaType: "YOUTUBE" }),
        MediaItem.countDocuments({ mediaType: "INSTAGRAM_REEL" }),
      ]);

    return NextResponse.json({
      success: true,
      count: items.length,
      stats: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        featured: featuredCount,
        images: imageCount,
        videos: videoCount,
        reels: reelCount,
      },
      items: items.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        description: item.description || "",
        mediaType: item.mediaType,
        category: item.category,
        imageUrl: item.imageUrl,
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.imageUrl].filter(Boolean),
        externalUrl: item.externalUrl || null,
        youtubeVideoId: item.youtubeVideoId || null,
        eventDate: item.eventDate || "",
        isFeatured: Boolean(item.isFeatured),
        isPublished: Boolean(item.isPublished),
        displayOrder: item.displayOrder ?? 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error("[Admin Media GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch media records." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/media
 * Create a new Media Item with backend URL validation and up to 10 photos.
 */
export async function POST(request: NextRequest) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description = "",
      mediaType = "IMAGE",
      category = "Darshan",
      imageUrl,
      images = [],
      externalUrl = "",
      eventDate = new Date().toISOString().slice(0, 10),
      isFeatured = false,
      isPublished = true,
      displayOrder = 0,
    } = body;

    // 1. Validation: Title
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Media title is required." },
        { status: 400 }
      );
    }

    // 2. Validation: Media Type & Images (up to 10)
    let finalImageUrl = (imageUrl || "").trim();
    let sanitizedImages: string[] = Array.isArray(images)
      ? images.map((u: any) => String(u).trim()).filter((u: string) => u.length > 0)
      : [];

    if (!finalImageUrl && sanitizedImages.length > 0) {
      finalImageUrl = sanitizedImages[0];
    } else if (finalImageUrl && !sanitizedImages.includes(finalImageUrl)) {
      sanitizedImages.unshift(finalImageUrl);
    }

    // Restrict max 10 photos
    sanitizedImages = sanitizedImages.slice(0, 10);

    let finalExternalUrl = (externalUrl || "").trim();
    let youtubeVideoId: string | undefined = undefined;

    const upperMediaType = (mediaType as string).toUpperCase() as MediaType;

    if (upperMediaType === "IMAGE") {
      if (!finalImageUrl && sanitizedImages.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one image is required for Image media type." },
          { status: 400 }
        );
      }
    } else if (upperMediaType === "YOUTUBE") {
      if (!finalExternalUrl) {
        return NextResponse.json(
          { success: false, error: "YouTube Video URL is required." },
          { status: 400 }
        );
      }
      const extractedId = extractYouTubeVideoId(finalExternalUrl);
      if (!extractedId) {
        return NextResponse.json(
          { success: false, error: "Invalid YouTube URL. Please provide a valid YouTube video link." },
          { status: 400 }
        );
      }
      youtubeVideoId = extractedId;
      if (!finalImageUrl) {
        finalImageUrl = getYouTubeThumbnail(extractedId, "maxres");
      }
      if (sanitizedImages.length === 0 && finalImageUrl) {
        sanitizedImages = [finalImageUrl];
      }
    } else if (upperMediaType === "INSTAGRAM_REEL") {
      if (!finalExternalUrl) {
        return NextResponse.json(
          { success: false, error: "Instagram Reel URL is required." },
          { status: 400 }
        );
      }
      if (!isValidInstagramUrl(finalExternalUrl)) {
        return NextResponse.json(
          { success: false, error: "Invalid Instagram Reel URL. Format: https://www.instagram.com/reel/..." },
          { status: 400 }
        );
      }
      if (!finalImageUrl && sanitizedImages.length > 0) {
        finalImageUrl = sanitizedImages[0];
      }
      if (!finalImageUrl || finalImageUrl === "/hero_bg.jpeg") {
        const instaData = await fetchInstagramPreview(finalExternalUrl);
        if (instaData?.imageUrl) {
          finalImageUrl = instaData.imageUrl;
        } else if (!finalImageUrl) {
          finalImageUrl = "/hero_bg.jpeg";
        }
      }
      if (sanitizedImages.length === 0 && finalImageUrl) {
        sanitizedImages = [finalImageUrl];
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid media type. Must be IMAGE, YOUTUBE, or INSTAGRAM_REEL." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newMedia = await MediaItem.create({
      title: title.trim(),
      description: description.trim(),
      mediaType: upperMediaType,
      category: category as MediaCategory,
      imageUrl: finalImageUrl,
      images: sanitizedImages,
      externalUrl: finalExternalUrl || undefined,
      youtubeVideoId,
      eventDate: eventDate.trim(),
      isFeatured: Boolean(isFeatured),
      isPublished: Boolean(isPublished),
      displayOrder: Number(displayOrder) || 0,
      createdBy: {
        id: adminContext.user._id?.toString(),
        name: adminContext.user.name,
        email: adminContext.user.email,
      },
      updatedBy: {
        id: adminContext.user._id?.toString(),
        name: adminContext.user.name,
        email: adminContext.user.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Media item created successfully.",
      data: newMedia,
    });
  } catch (error: any) {
    console.error("[Admin Media POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create media record." },
      { status: 500 }
    );
  }
}
