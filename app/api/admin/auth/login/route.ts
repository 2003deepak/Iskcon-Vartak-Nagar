import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import AdminSession from "@/models/AdminSession";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ensureDefaultAdminExists } from "@/lib/admin-init";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${ip}`, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.resetSeconds / 60)} minutes.`,
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

    const { identifier, password, rememberMe } = body;

    if (!identifier || typeof identifier !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Email/username and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await ensureDefaultAdminExists();

    const normalizedIdentifier = identifier.toLowerCase().trim();

    // Query by either email or username
    const user = await AdminUser.findOne({
      $or: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
    });

    // Timing-safe style generic rejection: do not reveal if account exists
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid email/username or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email/username or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = await generateAccessToken({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const isRemember = Boolean(rememberMe);
    const { token: refreshToken, jti: refreshJti, expiresAt, maxAgeSeconds } =
      await generateRefreshToken(user._id.toString(), isRemember);

    const refreshTokenHash = hashToken(refreshToken);

    // Save session in database
    const userAgent = request.headers.get("user-agent") || undefined;
    await AdminSession.create({
      userId: user._id,
      refreshTokenJti: refreshJti,
      refreshTokenHash,
      userAgent,
      ipAddress: ip,
      expiresAt,
    });

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookies
    setAuthCookies(response, accessToken, refreshToken, maxAgeSeconds);

    return response;
  } catch (error: any) {
    console.error("[Login Error]:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
