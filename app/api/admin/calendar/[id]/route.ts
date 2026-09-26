import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VaishnavEvent from "@/models/VaishnavEvent";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getCategoryConfig, DEFAULT_EVENT_LOCATION } from "@/lib/calendar-categories";
import { isValidDateString, parseDateString, isValidTimeString } from "@/lib/calendar-date-utils";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/calendar/[id]
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
        { success: false, error: "Invalid calendar entry ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const event = await VaishnavEvent.findById(id).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Calendar entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error("[Admin Calendar GET by ID Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch calendar entry." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/calendar/[id]
 * Update existing entry with validation and duplicate prevention.
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
        { success: false, error: "Invalid calendar entry ID format." },
        { status: 400 }
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

    // 3. Validation: Category & Color
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

    // 5. Duplicate Check excluding current item ID
    const trimmedTitle = title.trim();
    const existingDuplicate = await VaishnavEvent.findOne({
      _id: { $ne: id },
      dateString,
      title: { $regex: new RegExp(`^${trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      location: location.trim(),
    });

    if (existingDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `Another entry for "${trimmedTitle}" on ${dateString} at "${location}" already exists.`,
          duplicateId: existingDuplicate._id,
        },
        { status: 409 }
      );
    }

    const isoDate = new Date(`${dateString}T00:00:00.000Z`);

    const updatedEvent = await VaishnavEvent.findByIdAndUpdate(
      id,
      {
        title: trimmedTitle,
        dateString,
        year,
        date: isoDate,
        category: finalCategory,
        color: finalColor,
        isFast: Boolean(isFast),
        location: location.trim(),
        paranaDetails: sanitizedParana,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: "Calendar entry not found to update." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Calendar entry updated successfully.",
      event: updatedEvent,
    });
  } catch (error: any) {
    console.error("[Admin Calendar PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update calendar entry." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/calendar/[id]
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
        { success: false, error: "Invalid calendar entry ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deletedEvent = await VaishnavEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, error: "Calendar entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Deleted event "${deletedEvent.title}" (${deletedEvent.dateString}).`,
    });
  } catch (error: any) {
    console.error("[Admin Calendar DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete calendar entry." },
      { status: 500 }
    );
  }
}
