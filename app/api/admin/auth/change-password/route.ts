import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import AdminSession from "@/models/AdminSession";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { verifyPassword, hashPassword, validatePasswordStrength } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedAdmin(request);
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const body = await request.json().catch(() => null);

    const { currentPassword, newPassword, confirmNewPassword } = body || {};

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { success: false, error: "All password fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { success: false, error: "New passwords do not match" },
        { status: 400 }
      );
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const validation = validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.message || "New password does not meet security criteria" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newHash = await hashPassword(newPassword);
    await AdminUser.findByIdAndUpdate(user._id, { passwordHash: newHash });

    return NextResponse.json({
      success: true,
      message: "Password successfully updated",
    });
  } catch (error: any) {
    console.error("[Change Password Error]:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to update password" },
      { status: 500 }
    );
  }
}
