import { redis } from './redis';

export async function rateLimit(
    identifier: string,
    limit: number = 10,
    windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
    const key = `rate_limit:${identifier}`;

    try {
        const requests = await redis.incr(key);

        let ttl = await redis.ttl(key);
        if (ttl === -1) {
            await redis.expire(key, windowSeconds);
            ttl = windowSeconds;
        }

        return {
            success: requests <= limit,
            remaining: Math.max(0, limit - requests),
            reset: Date.now() + (ttl * 1000),
        };
    } catch (error) {
        console.error('Rate Limit Error:', error);
        // Fail open if Redis is down
        return { success: true, remaining: 1, reset: Date.now() };
    }
}
