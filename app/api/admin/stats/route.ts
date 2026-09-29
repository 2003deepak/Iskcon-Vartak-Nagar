import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthenticatedAdmin } from "@/lib/auth";
import ProgramEvent from "@/models/ProgramEvent";
import VaishnavEvent from "@/models/VaishnavEvent";
import AdminUser from "@/models/AdminUser";
import MediaItem from "@/models/MediaItem";
import VolunteerApplication from "@/models/VolunteerApplication";

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
      totalMedia,
      publishedMedia,
      featuredMedia,
      imageCount,
      videoCount,
      totalVolunteers,
      recentEvents,
      upcomingFestivals,
      recentMedia,
      recentVolunteers,
    ] = await Promise.all([
      VaishnavEvent.countDocuments(),
      VaishnavEvent.countDocuments({ year: currentYear }),
      ProgramEvent.countDocuments({ status: { $in: ["upcoming", "published"] } }),
      ProgramEvent.countDocuments({ status: "ongoing" }),
      ProgramEvent.countDocuments({ status: { $in: ["past", "archived"] } }),
      ProgramEvent.countDocuments({ isFeatured: true }),
      ProgramEvent.countDocuments(),
      AdminUser.countDocuments({ isActive: true }),
      MediaItem.countDocuments(),
      MediaItem.countDocuments({ isPublished: true }),
      MediaItem.countDocuments({ isFeatured: true }),
      MediaItem.countDocuments({ mediaType: "IMAGE" }),
      MediaItem.countDocuments({ mediaType: { $in: ["YOUTUBE", "INSTAGRAM_REEL"] } }),
      VolunteerApplication.countDocuments(),
      ProgramEvent.find().sort({ createdAt: -1 }).limit(5).lean(),
      VaishnavEvent.find({ year: currentYear }).sort({ dateString: 1 }).limit(5).lean(),
      MediaItem.find().sort({ createdAt: -1 }).limit(6).lean(),
      VolunteerApplication.find().sort({ submittedAt: -1 }).limit(5).lean(),
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
          totalMedia,
          publishedMedia,
          featuredMedia,
          imageCount,
          videoCount,
          totalVolunteers,
        },
        recentEvents,
        upcomingFestivals,
        recentMedia,
        recentVolunteers,
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
