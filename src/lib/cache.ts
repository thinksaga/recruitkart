import { redis } from './redis';

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redis.get(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch (error) {
            console.error('Redis Get Error:', error);
            return null;
        }
    },

    async set(key: string, value: any, ttlSeconds: number = 3600) {
        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        } catch (error) {
            console.error('Redis Set Error:', error);
        }
    },

    async del(key: string) {
        try {
            await redis.del(key);
        } catch (error) {
            console.error('Redis Del Error:', error);
        }
    },

    async invalidatePattern(pattern: string) {
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } catch (error) {
            console.error('Redis Invalidate Error:', error);
        }
    },
};
