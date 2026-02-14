import Redis from "ioredis";
import config from "./config";
import { logger } from "./logger";

let redisClient: Redis | null = null;
let pubRedis: Redis | null = null;
let subRedis: Redis | null = null;

// Initialize redis using URL (Upstash or any Redis URL)
if (config.redis.url) {
  redisClient = new Redis(config.redis.url);

  // 🔹 Duplicate clients for Socket.IO adapter
  pubRedis = redisClient.duplicate();
  subRedis = redisClient.duplicate();

  redisClient.on("connect", () => {
    logger.info("Redis connected successfully");
  });

  redisClient.on("error", (err) => {
    logger.error(`Redis connection error: ${err.message}`);
  });

  redisClient.on("close", () => {
    logger.warn("Redis connection closed");
  });
} else {
  logger.warn("Redis URL not provided. Redis features will be disabled.");
}

export default redisClient;
export { pubRedis, subRedis };


// ---------------- Helper functions ----------------

export const getCache = async (key: string): Promise<string | null> => {
  if (!redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (error: any) {
    logger.error(`Redis get error: ${error.message}`);
    return null;
  }
};

export const setCache = async (
  key: string,
  value: string,
  expirationSeconds?: number
): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    if (expirationSeconds) {
      await redisClient.setex(key, expirationSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error: any) {
    logger.error(`Redis set error: ${error.message}`);
    return false;
  }
};

export const deleteCache = async (key: string): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error: any) {
    logger.error(`Redis delete error: ${error.message}`);
    return false;
  }
};

// ⚠️ DO NOT USE IN PROD (keep for dev only)
export const clearCache = async (): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    await redisClient.flushall();
    return true;
  } catch (error: any) {
    logger.error(`Redis flush error: ${error.message}`);
    return false;
  }
};

// Scan and delete keys by pattern (safe version)
export const deleteKeysByPattern = async (pattern: string): Promise<number> => {
  if (!redisClient) return 0;

  try {
    const stream = redisClient.scanStream({
      match: pattern,
      count: 100,
    });

    let deleted = 0;

    for await (const keys of stream as any) {
      if (keys.length) {
        deleted += await redisClient.del(...keys);
      }
    }

    return deleted;
  } catch (error: any) {
    logger.error(`Delete keys by pattern error: ${error.message}`);
    return 0;
  }
};
