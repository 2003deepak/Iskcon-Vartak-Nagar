import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";
import AuditLog from "@/models/AuditLog";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { generateSlug } from "@/lib/slug-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/events
 * Admin event listing with status, category, search, and ordering filters.
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
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const isFeatured = searchParams.get("isFeatured");
    const sortBy = searchParams.get("sortBy") || "order";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;

    const query: Record<string, any> = {};

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (status && status !== "all") {
      query.status = status.toLowerCase().trim();
    }

    if (isFeatured && isFeatured !== "all") {
      query.isFeatured = isFeatured === "true";
    }

    if (search && search.trim().length > 0) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: new RegExp(sanitized, "i") },
        { subtitle: new RegExp(sanitized, "i") },
        { description: new RegExp(sanitized, "i") },
        { location: new RegExp(sanitized, "i") },
        { venue: new RegExp(sanitized, "i") },
        { slug: new RegExp(sanitized, "i") },
      ];
    }

    // Build sort object
    let sortObj: Record<string, any> = {};
    if (sortBy === "order") {
      sortObj = { order: 1, createdAt: -1 };
    } else if (sortBy === "date") {
      sortObj = { startDate: sortOrder, createdAt: -1 };
    } else if (sortBy === "createdAt") {
      sortObj = { createdAt: sortOrder };
    } else {
      sortObj = { [sortBy]: sortOrder };
    }

    const events = await ProgramEvent.find(query).sort(sortObj).lean();

    // Summary counts for admin statistics
    const [totalCount, publishedCount, draftCount, scheduledCount, archivedCount, featuredCount] =
      await Promise.all([
        ProgramEvent.countDocuments(),
        ProgramEvent.countDocuments({ status: { $in: ["published", "upcoming"] } }),
        ProgramEvent.countDocuments({ status: "draft" }),
        ProgramEvent.countDocuments({ status: "scheduled" }),
        ProgramEvent.countDocuments({ status: { $in: ["archived", "past"] } }),
        ProgramEvent.countDocuments({ isFeatured: true }),
      ]);

    return NextResponse.json({
      success: true,
      count: events.length,
      stats: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        scheduled: scheduledCount,
        archived: archivedCount,
        featured: featuredCount,
      },
      data: events,
    });
  } catch (error: any) {
    console.error("[Admin Events GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/events
 * Create a new Program Event with validation, slug uniqueness, and audit logging.
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
      slug: customSlug,
      subtitle,
      category = "Grand Festival",
      shortDescription,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      date,
      time,
      timezone = "Asia/Kolkata (IST)",
      location = "Main Temple Hall, ISKCON Vartak Nagar, Thane",
      venue,
      mapLink,
      bannerUrl,
      bannerImageMeta,
      thumbnailUrl,
      galleryImages,
      highlights,
      schedule,
      isFeatured = false,
      status = "published",
      order = 0,
      contactNumber = "+91 93228 81265",
      rsvpLink = "/support-us#donate",
      publishAt,
      unpublishAt,
    } = body;

    // 1. Validation: Title & Description
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

    if (!bannerUrl || typeof bannerUrl !== "string" || bannerUrl.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Event banner image URL is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Generate and ensure unique slug
    let baseSlug = generateSlug(customSlug || title);
    if (!baseSlug) {
      baseSlug = `event-${Date.now()}`;
    }

    let finalSlug = baseSlug;
    let counter = 1;
    while (await ProgramEvent.exists({ slug: finalSlug })) {
      counter++;
      finalSlug = `${baseSlug}-${counter}`;
    }

    // 3. Compute display date & time if not explicitly provided
    const finalDate = date?.trim() || startDate || "Upcoming";
    const finalTime = time?.trim() || (startTime ? `${startTime}${endTime ? ` – ${endTime}` : ""}` : "All Day");

    const isPublished = status === "published" || status === "upcoming";

    const newEvent = await ProgramEvent.create({
      title: title.trim(),
      slug: finalSlug,
      subtitle: subtitle?.trim(),
      category: category.trim(),
      shortDescription: shortDescription?.trim(),
      description: description.trim(),
      startDate: startDate?.trim(),
      startTime: startTime?.trim(),
      endDate: endDate?.trim(),
      endTime: endTime?.trim(),
      date: finalDate,
      time: finalTime,
      timezone: timezone.trim(),
      location: location.trim(),
      venue: venue?.trim(),
      mapLink: mapLink?.trim(),
      bannerUrl: bannerUrl.trim(),
      bannerImageMeta,
      thumbnailUrl: thumbnailUrl?.trim() || bannerUrl.trim(),
      galleryImages: Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [],
      highlights: Array.isArray(highlights) ? highlights.filter(Boolean) : [],
      schedule: Array.isArray(schedule)
        ? schedule.filter((s: any) => s && s.title && s.time)
        : [],
      isFeatured: Boolean(isFeatured),
      isPublished,
      status: status.toLowerCase().trim(),
      order: Number(order) || 0,
      contactNumber: contactNumber?.trim(),
      rsvpLink: rsvpLink?.trim(),
      publishAt: publishAt ? new Date(publishAt) : undefined,
      unpublishAt: unpublishAt ? new Date(unpublishAt) : undefined,
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

    // 4. Record Audit Log
    try {
      await AuditLog.create({
        action: "CREATE_EVENT",
        entityType: "Event",
        entityId: newEvent._id?.toString(),
        entityTitle: newEvent.title,
        performedBy: {
          id: adminContext.user._id?.toString(),
          name: adminContext.user.name,
          email: adminContext.user.email,
          role: adminContext.user.role,
        },
        details: {
          slug: newEvent.slug,
          category: newEvent.category,
          status: newEvent.status,
          isFeatured: newEvent.isFeatured,
        },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (auditErr) {
      console.warn("[Audit Log Error]:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Event created successfully.",
      data: newEvent,
    });
  } catch (error: any) {
    console.error("[Admin Event POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}
