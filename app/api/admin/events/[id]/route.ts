import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";
import AuditLog from "@/models/AuditLog";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { generateSlug } from "@/lib/slug-utils";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/events/[id]
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
        { success: false, error: "Invalid event ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const event = await ProgramEvent.findById(id).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error("[Admin Event GET by ID Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch event." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/events/[id]
 * Update event with slug collision protection and audit logging.
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
        { success: false, error: "Invalid event ID format." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug: customSlug,
      subtitle,
      category,
      shortDescription,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      date,
      time,
      timezone,
      location,
      venue,
      mapLink,
      bannerUrl,
      bannerImageMeta,
      thumbnailUrl,
      galleryImages,
      highlights,
      schedule,
      isFeatured,
      status,
      order,
      contactNumber,
      rsvpLink,
      publishAt,
      unpublishAt,
    } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Event title is required." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Event description is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check slug collision
    let finalSlug = generateSlug(customSlug || title);
    if (!finalSlug) finalSlug = `event-${Date.now()}`;

    const existingWithSlug = await ProgramEvent.findOne({
      _id: { $ne: id },
      slug: finalSlug,
    });

    if (existingWithSlug) {
      // Append number if collision
      let counter = 1;
      let candidateSlug = `${finalSlug}-${counter}`;
      while (await ProgramEvent.findOne({ _id: { $ne: id }, slug: candidateSlug })) {
        counter++;
        candidateSlug = `${finalSlug}-${counter}`;
      }
      finalSlug = candidateSlug;
    }

    const isPublished = status === "published" || status === "upcoming";
    const finalDate = date?.trim() || startDate || "Upcoming";
    const finalTime = time?.trim() || (startTime ? `${startTime}${endTime ? ` – ${endTime}` : ""}` : "All Day");

    const updateDoc: Record<string, any> = {
      title: title.trim(),
      slug: finalSlug,
      subtitle: subtitle?.trim(),
      category: category?.trim() || "Grand Festival",
      shortDescription: shortDescription?.trim(),
      description: description.trim(),
      startDate: startDate?.trim(),
      startTime: startTime?.trim(),
      endDate: endDate?.trim(),
      endTime: endTime?.trim(),
      date: finalDate,
      time: finalTime,
      timezone: timezone?.trim() || "Asia/Kolkata (IST)",
      location: location?.trim() || "Main Temple Hall, ISKCON Vartak Nagar, Thane",
      venue: venue?.trim(),
      mapLink: mapLink?.trim(),
      bannerUrl: bannerUrl?.trim(),
      thumbnailUrl: thumbnailUrl?.trim() || bannerUrl?.trim(),
      galleryImages: Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [],
      highlights: Array.isArray(highlights) ? highlights.filter(Boolean) : [],
      schedule: Array.isArray(schedule)
        ? schedule.filter((s: any) => s && s.title && s.time)
        : [],
      isFeatured: Boolean(isFeatured),
      isPublished,
      status: (status || "published").toLowerCase().trim(),
      order: Number(order) || 0,
      contactNumber: contactNumber?.trim(),
      rsvpLink: rsvpLink?.trim(),
      publishAt: publishAt ? new Date(publishAt) : undefined,
      unpublishAt: unpublishAt ? new Date(unpublishAt) : undefined,
      updatedBy: {
        id: adminContext.user._id?.toString(),
        name: adminContext.user.name,
        email: adminContext.user.email,
      },
    };

    if (bannerImageMeta) {
      updateDoc.bannerImageMeta = bannerImageMeta;
    }

    const updatedEvent = await ProgramEvent.findByIdAndUpdate(id, updateDoc, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found to update." },
        { status: 404 }
      );
    }

    // Record Audit Log
    try {
      const action =
        status === "published"
          ? "PUBLISH_EVENT"
          : status === "archived"
          ? "UNPUBLISH_EVENT"
          : "UPDATE_EVENT";

      await AuditLog.create({
        action,
        entityType: "Event",
        entityId: updatedEvent._id?.toString(),
        entityTitle: updatedEvent.title,
        performedBy: {
          id: adminContext.user._id?.toString(),
          name: adminContext.user.name,
          email: adminContext.user.email,
          role: adminContext.user.role,
        },
        details: {
          slug: updatedEvent.slug,
          category: updatedEvent.category,
          status: updatedEvent.status,
          isFeatured: updatedEvent.isFeatured,
        },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (auditErr) {
      console.warn("[Audit Log Error]:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully.",
      data: updatedEvent,
    });
  } catch (error: any) {
    console.error("[Admin Event PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update event." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/events/[id]
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
        { success: false, error: "Invalid event ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deletedEvent = await ProgramEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found." },
        { status: 404 }
      );
    }

    // Record Audit Log
    try {
      await AuditLog.create({
        action: "DELETE_EVENT",
        entityType: "Event",
        entityId: id,
        entityTitle: deletedEvent.title,
        performedBy: {
          id: adminContext.user._id?.toString(),
          name: adminContext.user.name,
          email: adminContext.user.email,
          role: adminContext.user.role,
        },
        details: {
          slug: deletedEvent.slug,
          category: deletedEvent.category,
        },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (auditErr) {
      console.warn("[Audit Log Error]:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Deleted event "${deletedEvent.title}".`,
    });
  } catch (error: any) {
    console.error("[Admin Event DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete event." },
      { status: 500 }
    );
  }
}
