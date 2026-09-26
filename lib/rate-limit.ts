interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  intervalMs?: number; // Time window (default 15 minutes = 900,000 ms)
  maxRequests?: number; // Max requests allowed per window (default 10)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and updates rate limit for a specific key (IP + Action)
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const intervalMs = options.intervalMs || 15 * 60 * 1000;
  const maxRequests = options.maxRequests || 10;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + intervalMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetSeconds: Math.ceil(intervalMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetSeconds: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Utility to extract client IP safely from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
