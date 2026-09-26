import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VaishnavEvent from "@/models/VaishnavEvent";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/calendar/[id]
 * Public read-only single event endpoint
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid calendar event ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const event = await VaishnavEvent.findById(id)
      .select("title year dateString category color isFast location paranaDetails date createdAt")
      .lean();

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Calendar event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error("[Public Calendar GET ID Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch event" },
      { status: 500 }
    );
  }
}
