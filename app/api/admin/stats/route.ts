import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthenticatedAdmin } from "@/lib/auth";
import ProgramEvent from "@/models/ProgramEvent";
import VaishnavEvent from "@/models/VaishnavEvent";
import AdminUser from "@/models/AdminUser";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedAdmin(request);
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const currentYear = new Date().getFullYear();

    // Query real counts in parallel
    const [
      totalCalendarEntries,
      currentYearCalendarEntries,
      upcomingEventsCount,
      ongoingEventsCount,
      pastEventsCount,
      featuredEventsCount,
      totalProgramEvents,
      totalAdmins,
      recentEvents,
      upcomingFestivals,
    ] = await Promise.all([
      VaishnavEvent.countDocuments(),
      VaishnavEvent.countDocuments({ year: currentYear }),
      ProgramEvent.countDocuments({ status: "upcoming" }),
      ProgramEvent.countDocuments({ status: "ongoing" }),
      ProgramEvent.countDocuments({ status: "past" }),
      ProgramEvent.countDocuments({ isFeatured: true }),
      ProgramEvent.countDocuments(),
      AdminUser.countDocuments({ isActive: true }),
      ProgramEvent.find().sort({ createdAt: -1 }).limit(5).lean(),
      VaishnavEvent.find({ year: currentYear }).sort({ dateString: 1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        currentYear,
        metrics: {
          totalCalendarEntries,
          currentYearCalendarEntries,
          upcomingEvents: upcomingEventsCount,
          ongoingEvents: ongoingEventsCount,
          pastEvents: pastEventsCount,
          featuredEvents: featuredEventsCount,
          totalProgramEvents,
          totalAdmins,
        },
        recentEvents,
        upcomingFestivals,
      },
    });
  } catch (error: any) {
    console.error("[Admin Stats Error]:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
