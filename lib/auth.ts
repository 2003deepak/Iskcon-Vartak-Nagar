import { SignJWT, jwtVerify, JWTPayload } from "jose";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "./mongodb";
import AdminUser, { AdminRole, IAdminUser } from "@/models/AdminUser";
import AdminSession, { IAdminSession } from "@/models/AdminSession";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "iskcon-vartak-nagar-access-super-secret-key-2026-secure";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "iskcon-vartak-nagar-refresh-super-secret-key-2026-secure";

// Expiration constants
export const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
export const ACCESS_TOKEN_MAX_AGE_SEC = 15 * 60; // 900 seconds
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;
export const REFRESH_TOKEN_REMEMBER_EXPIRY_DAYS = 30;

export const ACCESS_COOKIE_NAME = "admin_access_token";
export const REFRESH_COOKIE_NAME = "admin_refresh_token";

const accessSecretKey = new TextEncoder().encode(JWT_ACCESS_SECRET);
const refreshSecretKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

export interface AdminTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
  jti: string;
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  jti: string;
}

/**
 * Creates a SHA-256 hash of any token string
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a cryptographically secure random token (e.g. for password resets)
 */
export function generateSecureRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a short-lived access token JWT
 */
export async function generateAccessToken(user: {
  _id: string | object;
  email: string;
  name: string;
  role: AdminRole;
}): Promise<string> {
  const jti = crypto.randomUUID();
  const userId = user._id.toString();

  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(accessSecretKey);
}

/**
 * Generates a long-lived rotating refresh token JWT
 */
export async function generateRefreshToken(
  userId: string,
  rememberMe: boolean = false
): Promise<{ token: string; jti: string; expiresAt: Date; maxAgeSeconds: number }> {
  const jti = crypto.randomUUID();
  const days = rememberMe ? REFRESH_TOKEN_REMEMBER_EXPIRY_DAYS : REFRESH_TOKEN_EXPIRY_DAYS;
  const maxAgeSeconds = days * 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(refreshSecretKey);

  return { token, jti, expiresAt, maxAgeSeconds };
}

/**
 * Verifies and decodes an access token
 */
export async function verifyAccessToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecretKey);
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verifies and decodes a refresh token
 */
export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecretKey);
    return payload as RefreshTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Set HTTP-Only authentication cookies on response
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  refreshMaxAgeSeconds: number
) {
  const isProduction = process.env.NODE_ENV === "production";

  // Access Token Cookie
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SEC,
  });

  // Refresh Token Cookie
  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: refreshMaxAgeSeconds,
  });
}

/**
 * Clear authentication cookies on logout or session revocation
 */
export function clearAuthCookies(response: NextResponse) {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Extract authenticated user context from Request (supports cookies or Authorization Bearer header)
 */
export async function getAuthenticatedAdmin(
  request?: NextRequest | Request
): Promise<{ user: IAdminUser; payload: AdminTokenPayload } | null> {
  try {
    let token: string | undefined;

    if (request && "cookies" in request && typeof (request as NextRequest).cookies?.get === "function") {
      token = (request as NextRequest).cookies.get(ACCESS_COOKIE_NAME)?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
    }

    if (!token && request) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.sub) {
      return null;
    }

    await connectToDatabase();
    const user = await AdminUser.findById(payload.sub);
    if (!user || !user.isActive) {
      return null;
    }

    return { user, payload };
  } catch {
    return null;
  }
}
