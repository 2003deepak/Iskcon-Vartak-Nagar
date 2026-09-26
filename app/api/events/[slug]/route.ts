import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/events/[slug]
 * Public endpoint to fetch single published event by slug or ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Event slug or ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const now = new Date();

    const query: Record<string, any> = {
      status: { $in: ["published", "upcoming"] },
      $or: [
        { publishAt: { $exists: false } },
        { publishAt: null },
        { publishAt: { $lte: now } },
      ],
    };

    if (mongoose.Types.ObjectId.isValid(slug)) {
      query.$and = [{ $or: [{ slug }, { _id: slug }] }];
    } else {
      query.slug = slug;
    }

    const event = await ProgramEvent.findOne(query)
      .select(
        "title slug subtitle category shortDescription description startDate startTime endDate endTime date time timezone location venue mapLink bannerUrl thumbnailUrl galleryImages highlights schedule isFeatured contactNumber rsvpLink"
      )
      .lean();

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found or not published" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error("[Public Single Event GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch event" },
      { status: 500 }
    );
  }
}
