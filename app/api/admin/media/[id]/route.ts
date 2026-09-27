import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import MediaItem, { MediaType, MediaCategory } from "@/models/MediaItem";
import AuditLog from "@/models/AuditLog";
import { getAuthenticatedAdmin } from "@/lib/auth";
import {
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  isValidHttpUrl,
  isValidInstagramUrl,
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
      subcategory,
      imageUrl,
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
    let finalExternalUrl = (externalUrl || "").trim();
    let youtubeVideoId: string | undefined = undefined;

    const upperMediaType = (mediaType || "IMAGE").toUpperCase() as MediaType;

    if (upperMediaType === "IMAGE") {
      if (!finalImageUrl) {
        return NextResponse.json(
          { success: false, error: "Image URL is required for Image type." },
          { status: 400 }
        );
      }
      if (!isValidHttpUrl(finalImageUrl)) {
        return NextResponse.json(
          { success: false, error: "Invalid image URL format." },
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
      if (!finalImageUrl) {
        finalImageUrl = "/hero_bg.jpeg";
      }
    }

    await connectToDatabase();

    const updateDoc: Record<string, any> = {
      title: title.trim(),
      description: (description || "").trim(),
      mediaType: upperMediaType,
      category: (category || "Darshan") as MediaCategory,
      subcategory: (subcategory || "").trim(),
      imageUrl: finalImageUrl,
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

    // Audit log
    try {
      await AuditLog.create({
        action: "UPDATE_MEDIA",
        entityType: "Media",
        entityId: updated._id?.toString(),
        entityTitle: updated.title,
        performedBy: {
          id: adminContext.user._id?.toString(),
          name: adminContext.user.name,
          email: adminContext.user.email,
          role: adminContext.user.role,
        },
        details: {
          mediaType: updated.mediaType,
          category: updated.category,
          isPublished: updated.isPublished,
          isFeatured: updated.isFeatured,
        },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (auditErr) {
      console.warn("[Audit Log Warning]:", auditErr);
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

    // Audit log
    try {
      await AuditLog.create({
        action: "DELETE_MEDIA",
        entityType: "Media",
        entityId: id,
        entityTitle: deleted.title,
        performedBy: {
          id: adminContext.user._id?.toString(),
          name: adminContext.user.name,
          email: adminContext.user.email,
          role: adminContext.user.role,
        },
        details: {
          mediaType: deleted.mediaType,
          category: deleted.category,
        },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (auditErr) {
      console.warn("[Audit Log Warning]:", auditErr);
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
