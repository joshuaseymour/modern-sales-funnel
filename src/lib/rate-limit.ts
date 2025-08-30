// Simple in-memory rate limiting for development
// In production, use Redis or Vercel KV for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function rateLimit(identifier: string, config: RateLimitConfig): {
  success: boolean;
  remainingRequests: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(identifier);
  }

  const currentEntry = rateLimitStore.get(identifier);
  
  if (!currentEntry) {
    // First request in window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remainingRequests: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (currentEntry.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remainingRequests: 0,
      resetTime: currentEntry.resetTime,
    };
  }

  // Increment counter
  currentEntry.count++;
  rateLimitStore.set(identifier, currentEntry);

  return {
    success: true,
    remainingRequests: config.maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

// Helper function to get client IP from Next.js request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}