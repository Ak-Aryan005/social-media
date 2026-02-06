import Redis from "ioredis";
import config from "../config/config";

export const redis = new Redis(config.redis.url);

export const pubRedis = redis.duplicate();
export const subRedis = redis.duplicate();
