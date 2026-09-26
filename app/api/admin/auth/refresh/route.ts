import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import AdminSession from "@/models/AdminSession";
import {
  REFRESH_COOKIE_NAME,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth";
import { getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        { success: false, error: "No refresh token provided" },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || !payload.sub || !payload.jti) {
      const response = NextResponse.json(
        { success: false, error: "Invalid or expired refresh token" },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    const userId = payload.sub;
    const jti = payload.jti;
    const incomingTokenHash = hashToken(refreshToken);

    await connectToDatabase();

    const session = await AdminSession.findOne({ refreshTokenJti: jti });

    // REUSE DETECTION:
    // If session doesn't exist or is already revoked / replaced, reuse is detected!
    if (!session || session.isRevoked || session.replacedByJti) {
      console.warn(`[Security Warning] Refresh token reuse detected for user ${userId}. Revoking all sessions.`);
      await AdminSession.updateMany(
        { userId },
        { isRevoked: true, revokedAt: new Date() }
      );

      const response = NextResponse.json(
        {
          success: false,
          error: "Session compromised or already rotated. Please log in again.",
        },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Verify token hash match
    if (session.refreshTokenHash !== incomingTokenHash) {
      console.warn(`[Security Warning] Hash mismatch for session ${jti}. Revoking.`);
      session.isRevoked = true;
      session.revokedAt = new Date();
      await session.save();

      const response = NextResponse.json(
        { success: false, error: "Invalid session token. Please log in again." },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Verify expiration
    if (new Date() > new Date(session.expiresAt)) {
      session.isRevoked = true;
      session.revokedAt = new Date();
      await session.save();

      const response = NextResponse.json(
        { success: false, error: "Session expired. Please log in again." },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Find active user
    const user = await AdminUser.findById(userId);
    if (!user || !user.isActive) {
      session.isRevoked = true;
      session.revokedAt = new Date();
      await session.save();

      const response = NextResponse.json(
        { success: false, error: "User account is disabled or no longer exists." },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // TOKEN ROTATION:
    // 1. Generate new refresh token
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || session.userAgent;
    const { token: newRefreshToken, jti: newJti, expiresAt, maxAgeSeconds } =
      await generateRefreshToken(user._id.toString(), false);

    const newRefreshTokenHash = hashToken(newRefreshToken);

    // 2. Mark old session as replaced & revoked
    session.isRevoked = true;
    session.revokedAt = new Date();
    session.replacedByJti = newJti;
    await session.save();

    // 3. Create new session document
    await AdminSession.create({
      userId: user._id,
      refreshTokenJti: newJti,
      refreshTokenHash: newRefreshTokenHash,
      userAgent,
      ipAddress: ip,
      expiresAt,
    });

    // 4. Generate new access token
    const newAccessToken = await generateAccessToken({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

    setAuthCookies(response, newAccessToken, newRefreshToken, maxAgeSeconds);
    return response;
  } catch (error: any) {
    console.error("[Refresh Error]:", error?.message || error);
    const response = NextResponse.json(
      { success: false, error: "Failed to refresh token" },
      { status: 500 }
    );
    return response;
  }
}
