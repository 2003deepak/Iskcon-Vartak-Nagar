import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";

export const dynamic = "force-dynamic";

/**
 * GET /api/events/upcoming
 * Returns published upcoming events ordered by date/priority
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    await connectToDatabase();
    const now = new Date();

    const events = await ProgramEvent.find({
      status: { $in: ["published", "upcoming"] },
      $or: [
        { publishAt: { $exists: false } },
        { publishAt: null },
        { publishAt: { $lte: now } },
      ],
    })
      .sort({ order: 1, startDate: 1, createdAt: -1 })
      .limit(limit)
      .select(
        "title slug subtitle category shortDescription description date time location venue mapLink bannerUrl thumbnailUrl highlights schedule isFeatured contactNumber rsvpLink"
      )
      .lean();

    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    console.error("[Upcoming Events GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch upcoming events" },
      { status: 500 }
    );
  }
}
