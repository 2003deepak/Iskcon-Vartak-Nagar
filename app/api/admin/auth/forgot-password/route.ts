import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { generateSecureRandomToken, hashToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`forgot-password:${ip}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 3,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset attempts. Please try again in ${Math.ceil(rateLimit.resetSeconds / 60)} minutes.`,
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
    const email = body?.email;

    // Standard generic response message to prevent account enumeration
    const genericSuccessResponse = {
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json(genericSuccessResponse);
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectToDatabase();
    const user = await AdminUser.findOne({ email: normalizedEmail });

    if (user && user.isActive) {
      // 1. Generate secure one-time token
      const rawResetToken = generateSecureRandomToken();
      const tokenHash = hashToken(rawResetToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

      // 2. Store only token hash & expiry in database
      user.passwordResetTokenHash = tokenHash;
      user.passwordResetExpiresAt = expiresAt;
      await user.save();

      // 3. Determine base URL
      const origin =
        process.env.FRONTEND_URL ||
        request.nextUrl.origin ||
        "http://localhost:3000";

      const resetUrl = `${origin}/admin/reset-password?token=${rawResetToken}`;

      // 4. Send reset email asynchronously (raw token never logged)
      await sendPasswordResetEmail({
        toEmail: user.email,
        recipientName: user.name,
        resetUrl,
      });
    }

    return NextResponse.json(genericSuccessResponse);
  } catch (error: any) {
    console.error("[Forgot Password Error]:", error?.message || error);
    // Return generic message even on internal error to avoid revealing state
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  }
}
