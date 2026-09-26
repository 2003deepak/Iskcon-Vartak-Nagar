import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VaishnavEvent from "@/models/VaishnavEvent";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { isValidCategoryId, getCategoryConfig, DEFAULT_EVENT_LOCATION } from "@/lib/calendar-categories";
import { isValidDateString, parseDateString, isValidTimeString } from "@/lib/calendar-date-utils";

/**
 * GET /api/admin/calendar
 * Query Parameters:
 * - year: number (e.g. 2026)
 * - month: number (1-12)
 * - category: string
 * - search: string
 * - isFast: boolean ("true" | "false")
 * - page: number
 * - limit: number
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
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const isFastParam = searchParams.get("isFast");

    const query: Record<string, any> = {};

    if (yearParam && yearParam !== "all") {
      const parsedYear = parseInt(yearParam, 10);
      if (!isNaN(parsedYear)) {
        query.year = parsedYear;
      }
    }

    if (monthParam && monthParam !== "all") {
      const parsedMonth = parseInt(monthParam, 10);
      if (!isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
        const monthStr = String(parsedMonth).padStart(2, "0");
        // Match dateString matching -MM-
        if (query.year) {
          query.dateString = new RegExp(`^${query.year}-${monthStr}`);
        } else {
          query.dateString = new RegExp(`^\\d{4}-${monthStr}`);
        }
      }
    }

    if (categoryParam && categoryParam !== "all") {
      query.category = categoryParam.toLowerCase();
    }

    if (isFastParam && isFastParam !== "all") {
      query.isFast = isFastParam === "true";
    }

    if (searchParam && searchParam.trim().length > 0) {
      const sanitized = searchParam.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: new RegExp(sanitized, "i") },
        { location: new RegExp(sanitized, "i") },
        { dateString: new RegExp(sanitized, "i") },
      ];
    }

    const events = await VaishnavEvent.find(query)
      .sort({ dateString: 1, title: 1 })
      .lean();

    // Calculate quick stats for the selected year/filters
    const totalEvents = events.length;
    const fastingCount = events.filter((e) => e.isFast).length;
    const ekadashiCount = events.filter(
      (e) =>
        e.category === "ekadashi" ||
        e.category === "mahadvadasi" ||
        e.title.toLowerCase().includes("ekadasi") ||
        e.title.toLowerCase().includes("ekadashi")
    ).length;
    const festivalCount = events.filter((e) => e.category === "festival").length;

    return NextResponse.json({
      success: true,
      count: totalEvents,
      stats: {
        total: totalEvents,
        fasting: fastingCount,
        ekadashi: ekadashiCount,
        festivals: festivalCount,
      },
      events,
    });
  } catch (error: any) {
    console.error("[Admin Calendar GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch calendar entries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/calendar
 * Create a new Vaishnava Calendar entry with validation and duplicate protection.
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
      dateString,
      category = "festival",
      color,
      isFast = false,
      location = DEFAULT_EVENT_LOCATION,
      paranaDetails,
    } = body;

    // 1. Validation: Title
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Event title is required." },
        { status: 400 }
      );
    }

    // 2. Validation: Date String
    if (!dateString || !isValidDateString(dateString)) {
      return NextResponse.json(
        { success: false, error: "Invalid date. Please provide a valid date in YYYY-MM-DD format." },
        { status: 400 }
      );
    }

    const parsedDate = parseDateString(dateString);
    if (!parsedDate) {
      return NextResponse.json(
        { success: false, error: "Failed to parse event date." },
        { status: 400 }
      );
    }
    const year = parsedDate.year;

    // 3. Validation: Category
    const categoryConfig = getCategoryConfig(category);
    const finalCategory = categoryConfig.id;
    const finalColor = color || categoryConfig.defaultColor;

    // 4. Validation: Fasting & Parana Details
    let sanitizedParana: Record<string, string> | null = null;
    if (isFast) {
      if (paranaDetails) {
        const { date: pDate, startTime: pStart, endTime: pEnd } = paranaDetails;

        if (pDate && !isValidDateString(pDate)) {
          return NextResponse.json(
            { success: false, error: "Parana date is invalid. Format must be YYYY-MM-DD." },
            { status: 400 }
          );
        }

        if (pStart && !isValidTimeString(pStart)) {
          return NextResponse.json(
            { success: false, error: `Invalid Parana start time '${pStart}'. Examples: '06:15 AM' or '06:15'.` },
            { status: 400 }
          );
        }

        if (pEnd && !isValidTimeString(pEnd)) {
          return NextResponse.json(
            { success: false, error: `Invalid Parana end time '${pEnd}'. Examples: '10:30 AM' or '10:30'.` },
            { status: 400 }
          );
        }

        sanitizedParana = {
          date: pDate ? pDate.trim() : "",
          startTime: pStart ? pStart.trim() : "",
          endTime: pEnd ? pEnd.trim() : "",
        };
      }
    }

    await connectToDatabase();

    // 5. Duplicate Protection: check title (case-insensitive), dateString, and location
    const trimmedTitle = title.trim();
    const existingDuplicate = await VaishnavEvent.findOne({
      dateString,
      title: { $regex: new RegExp(`^${trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      location: location.trim(),
    });

    if (existingDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `An entry for "${trimmedTitle}" on ${dateString} at "${location}" already exists.`,
          duplicateId: existingDuplicate._id,
        },
        { status: 409 }
      );
    }

    // Construct UTC ISODate representation
    const isoDate = new Date(`${dateString}T00:00:00.000Z`);

    const newEvent = await VaishnavEvent.create({
      title: trimmedTitle,
      dateString,
      year,
      date: isoDate,
      category: finalCategory,
      color: finalColor,
      isFast: Boolean(isFast),
      location: location.trim(),
      paranaDetails: sanitizedParana,
    });

    return NextResponse.json({
      success: true,
      message: "Calendar entry created successfully.",
      event: newEvent,
    });
  } catch (error: any) {
    console.error("[Admin Calendar POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create calendar entry" },
      { status: 500 }
    );
  }
}
