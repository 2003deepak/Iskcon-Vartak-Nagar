import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AdminSession from "@/models/AdminSession";
import {
  REFRESH_COOKIE_NAME,
  verifyRefreshToken,
  clearAuthCookies,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload && payload.jti) {
        try {
          await connectToDatabase();
          await AdminSession.updateOne(
            { refreshTokenJti: payload.jti },
            { isRevoked: true, revokedAt: new Date() }
          );
        } catch (dbError) {
          console.warn("[Logout Session Revocation Warning]:", dbError);
        }
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    clearAuthCookies(response);
    return response;
  } catch (error: any) {
    console.error("[Logout Error]:", error?.message || error);
    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });
    clearAuthCookies(response);
    return response;
  }
}
