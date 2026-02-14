import { redis } from "./index";

export const setOnline = async (userId: string, socketId: string) => {
  await redis.set(`online:${userId}`, socketId, "EX", 30);
};

export const refreshOnline = async (userId: string) => {
  await redis.expire(`online:${userId}`, 30);
};

export const isOnline = async (userId: string) => {
  return redis.exists(`online:${userId}`);
};
