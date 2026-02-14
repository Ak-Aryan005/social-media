import { redis } from "./index";

export const pushNotification = async (
  userId: string,
  data: Record<string, string>
) => {
  return redis.xadd(
    `notify:${userId}`,
    "*",
    ...Object.entries(data).flat()
  );
};
