import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";

export const dynamic = "force-dynamic";

/**
 * GET /api/events/featured
 * Returns the currently active featured published event for homepage hero / spotlights
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const now = new Date();

    const featuredEvent = await ProgramEvent.findOne({
      status: { $in: ["published", "upcoming"] },
      isFeatured: true,
      $or: [
        { publishAt: { $exists: false } },
        { publishAt: null },
        { publishAt: { $lte: now } },
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .select(
        "title slug subtitle category shortDescription description date time location venue mapLink bannerUrl thumbnailUrl highlights schedule contactNumber rsvpLink isFeatured"
      )
      .lean();

    if (!featuredEvent) {
      // Fallback to top published event if none is explicitly featured
      const fallbackEvent = await ProgramEvent.findOne({
        status: { $in: ["published", "upcoming"] },
      })
        .sort({ order: 1, createdAt: -1 })
        .select(
          "title slug subtitle category shortDescription description date time location venue mapLink bannerUrl thumbnailUrl highlights schedule contactNumber rsvpLink isFeatured"
        )
        .lean();

      return NextResponse.json({
        success: true,
        data: fallbackEvent || null,
      });
    }

    return NextResponse.json({
      success: true,
      data: featuredEvent,
    });
  } catch (error: any) {
    console.error("[Featured Event GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch featured event" },
      { status: 500 }
    );
  }
}
