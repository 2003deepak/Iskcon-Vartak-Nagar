import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import AdminSession from "@/models/AdminSession";
import { hashToken, clearAuthCookies } from "@/lib/auth";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`reset-password:${ip}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many attempts. Please try again in ${Math.ceil(rateLimit.resetSeconds / 60)} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { token, password, confirmPassword } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Password reset token is missing or invalid" },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter and confirm your new password" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.message || "Password does not meet requirements" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Hash the token received from client to compare with database
    const tokenHash = hashToken(token.trim());

    // Find user with matching unexpired reset token
    const user = await AdminUser.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "This password reset link is invalid, expired, or has already been used.",
        },
        { status: 400 }
      );
    }

    // 1. Update password
    const newPasswordHash = await hashPassword(password);
    user.passwordHash = newPasswordHash;

    // 2. Invalidate reset token (single-use)
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    // 3. Invalidate ALL existing active sessions for this user across all devices
    await AdminSession.updateMany(
      { userId: user._id },
      { isRevoked: true, revokedAt: new Date() }
    );

    const response = NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You can now log in with your new password.",
    });

    // Clear any existing auth cookies
    clearAuthCookies(response);

    return response;
  } catch (error: any) {
    console.error("[Reset Password Error]:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "An error occurred while resetting your password." },
      { status: 500 }
    );
  }
}
