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
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/media/[id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid media ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const item = await MediaItem.findById(id).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Media item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error("[Admin Media GET by ID Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch media item." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/media/[id]
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid media ID format." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      mediaType,
      category,
      imageUrl,
      images = [],
      externalUrl,
      eventDate,
      isFeatured,
      isPublished,
      displayOrder,
    } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    let finalImageUrl = (imageUrl || "").trim();
    let sanitizedImages: string[] = Array.isArray(images)
      ? images.map((u: any) => String(u).trim()).filter((u: string) => u.length > 0)
      : [];

    if (!finalImageUrl && sanitizedImages.length > 0) {
      finalImageUrl = sanitizedImages[0];
    } else if (finalImageUrl && !sanitizedImages.includes(finalImageUrl)) {
      sanitizedImages.unshift(finalImageUrl);
    }

    sanitizedImages = sanitizedImages.slice(0, 10);

    let finalExternalUrl = (externalUrl || "").trim();
    let youtubeVideoId: string | undefined = undefined;

    const upperMediaType = (mediaType || "IMAGE").toUpperCase() as MediaType;

    if (upperMediaType === "IMAGE") {
      if (!finalImageUrl && sanitizedImages.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one image is required for Image type." },
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
          { success: false, error: "Invalid YouTube URL." },
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
          { success: false, error: "Invalid Instagram Reel URL." },
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
    }

    await connectToDatabase();

    const updateDoc: Record<string, any> = {
      title: title.trim(),
      description: (description || "").trim(),
      mediaType: upperMediaType,
      category: (category || "Darshan") as MediaCategory,
      imageUrl: finalImageUrl,
      images: sanitizedImages,
      externalUrl: finalExternalUrl || undefined,
      youtubeVideoId,
      eventDate: eventDate ? eventDate.trim() : undefined,
      isFeatured: Boolean(isFeatured),
      isPublished: Boolean(isPublished),
      displayOrder: Number(displayOrder) || 0,
      updatedBy: {
        id: adminContext.user._id?.toString(),
        name: adminContext.user.name,
        email: adminContext.user.email,
      },
    };

    const updated = await MediaItem.findByIdAndUpdate(id, updateDoc, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Media item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Media item updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[Admin Media PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update media item." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid media ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deleted = await MediaItem.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Media item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Deleted media item "${deleted.title}".`,
    });
  } catch (error: any) {
    console.error("[Admin Media DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete media item." },
      { status: 500 }
    );
  }
}
