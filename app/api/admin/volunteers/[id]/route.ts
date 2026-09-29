import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VolunteerApplication from "@/models/VolunteerApplication";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/volunteers/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const application = await VolunteerApplication.findById(id).lean();
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Volunteer application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("[GET /api/admin/volunteers/[id] Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch application." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/volunteers/[id]
 * Update notes or seva department
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { adminNotes, sevaInterest } = body;

    await connectToDatabase();

    const existing = await VolunteerApplication.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Volunteer application not found." },
        { status: 404 }
      );
    }

    const updateFields: Record<string, any> = {};

    if (adminNotes !== undefined) {
      updateFields.adminNotes = adminNotes;
    }

    if (sevaInterest) {
      updateFields.sevaInterest = sevaInterest;
    }

    const updated = await VolunteerApplication.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Volunteer notes updated successfully.",
      application: updated,
    });
  } catch (error: any) {
    console.error("[PATCH /api/admin/volunteers/[id] Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update volunteer application." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/volunteers/[id]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await VolunteerApplication.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Volunteer application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Volunteer application deleted successfully.",
    });
  } catch (error: any) {
    console.error("[DELETE /api/admin/volunteers/[id] Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete volunteer application." },
      { status: 500 }
    );
  }
}
