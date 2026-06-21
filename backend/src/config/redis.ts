import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
let isRedisConnected = false;

const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 1,
  showFriendlyErrorStack: true,
  retryStrategy(times) {
    if (times > 3) {
      // Stop retrying and fallback to memory cache
      return null;
    }
    return Math.min(times * 100, 2000);
  },
});

redisClient.on("error", (err: any) => {
  console.warn("Redis client error, caching will use in-memory fallback:", err.message);
  isRedisConnected = false;
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready and connected.");
  isRedisConnected = true;
});

redisClient.on("end", () => {
  console.warn("Redis connection closed.");
  isRedisConnected = false;
});

// In-Memory cache fallback implementation
interface MemoryCacheEntry {
  value: string;
  expiresAt: number | null;
}
const memoryCache = new Map<string, MemoryCacheEntry>();

export async function getCache<T = any>(key: string): Promise<T | null> {
  if (isRedisConnected) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (err) {
      console.error("Redis getCache error:", err);
    }
  }

  // Fallback
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  try {
    return JSON.parse(entry.value) as T;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const serialized = JSON.stringify(value);

  if (isRedisConnected) {
    try {
      if (ttlSeconds) {
        await redisClient.set(key, serialized, "EX", ttlSeconds);
      } else {
        await redisClient.set(key, serialized);
      }
      return;
    } catch (err) {
      console.error("Redis setCache error:", err);
    }
  }

  // Fallback
  const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
  memoryCache.set(key, { value: serialized, expiresAt });
}

export async function delCache(key: string): Promise<void> {
  if (isRedisConnected) {
    try {
      await redisClient.del(key);
      return;
    } catch (err) {
      console.error("Redis delCache error:", err);
    }
  }

  // Fallback
  memoryCache.delete(key);
}

/**
 * Delete keys matching a pattern (e.g. "notices:*" or "dashboard:schoolId:*")
 */
export async function delCachePattern(pattern: string): Promise<void> {
  if (isRedisConnected) {
    try {
      // In ioredis, SCAN returns a tuple of [nextCursor, keys]
      let cursor = "0";
      const keysToDelete: string[] = [];

      do {
        const reply = await redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = reply[0];
        keysToDelete.push(...reply[1]);
      } while (cursor !== "0");

      if (keysToDelete.length > 0) {
        await redisClient.del(...keysToDelete);
      }
      return;
    } catch (err) {
      console.error("Redis delCachePattern error:", err);
    }
  }

  // Fallback: match pattern in memory
  // Map standard glob wildcard '*' to a simple regex
  const regexString = "^" + pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, (ch) => (ch === "*" ? ".*" : "\\" + ch)) + "$";
  const regex = new RegExp(regexString);

  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}
