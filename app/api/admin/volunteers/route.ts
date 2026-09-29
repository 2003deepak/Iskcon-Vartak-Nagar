import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VolunteerApplication from "@/models/VolunteerApplication";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/volunteers
 * List all volunteer applications with filtering and search
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
    const search = searchParams.get("search");
    const seva = searchParams.get("seva");
    const sortBy = searchParams.get("sortBy") || "submittedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const query: Record<string, any> = {};

    if (seva && seva !== "ALL") {
      query.sevaInterest = { $regex: new RegExp(seva.trim(), "i") };
    }

    if (search && search.trim().length > 0) {
      const term = search.trim();
      query.$or = [
        { fullName: { $regex: term, $options: "i" } },
        { phone: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
        { applicationNumber: { $regex: term, $options: "i" } },
        { adminNotes: { $regex: term, $options: "i" } },
      ];
    }

    const sortOption: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const applications = await VolunteerApplication.find(query)
      .sort(sortOption)
      .lean();

    const totalCount = await VolunteerApplication.countDocuments();

    return NextResponse.json({
      success: true,
      applications,
      totalCount,
    });
  } catch (error: any) {
    console.error("[GET /api/admin/volunteers Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load volunteer applications" },
      { status: 500 }
    );
  }
}
