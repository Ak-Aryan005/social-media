import { redis } from "./index";

export const saveMessage = async (
  roomId: string,
  from: string,
  to: string,
  text: string
) => {
  return redis.xadd(
    `chat:${roomId}`,
    "*",
    "from", from,
    "to", to,
    "text", text
  );
};

export const getMessages = async (roomId: string, count = 50) => {
  return redis.xrevrange(`chat:${roomId}`, "+", "-", "COUNT", count);
};
