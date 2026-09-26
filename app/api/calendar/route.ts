import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VaishnavEvent from "@/models/VaishnavEvent";

/**
 * GET /api/calendar
 * Public Read-Only Endpoint for Vaishnava Calendar
 * Parameters:
 * - year: number (e.g. 2026, 2027)
 * - month: number (1-12)
 * - category: string (e.g. "festival", "ekadashi")
 * - search: string
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

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

    if (searchParam && searchParam.trim().length > 0) {
      const sanitized = searchParam.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: new RegExp(sanitized, "i") },
        { location: new RegExp(sanitized, "i") },
        { dateString: new RegExp(sanitized, "i") },
      ];
    }

    await connectToDatabase();
    const events = await VaishnavEvent.find(query)
      .sort({ dateString: 1, title: 1 })
      .select("title year dateString category color isFast location paranaDetails date createdAt")
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: events.length,
        events,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("[Public Calendar GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
