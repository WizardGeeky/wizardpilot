export interface RateLimiter {
  isAllowed(key: string, limit: number, windowSeconds: number): Promise<{
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
  }>;
}

interface BucketEntry {
  count: number;
  resetTime: number;
}

export class InMemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, BucketEntry>();

  public async isAllowed(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
    const now = Date.now();
    const entry = this.buckets.get(key);

    if (!entry || now > entry.resetTime) {
      const resetTime = now + windowSeconds * 1000;
      this.buckets.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: limit - 1,
        resetInSeconds: windowSeconds,
      };
    }

    if (entry.count < limit) {
      entry.count += 1;
      const resetInSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
      return {
        allowed: true,
        remaining: limit - entry.count,
        resetInSeconds,
      };
    }

    const resetInSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }
}

export const rateLimiter = new InMemoryRateLimiter();
