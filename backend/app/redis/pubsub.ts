import { pubRedis, subRedis } from "./index";

export const publish = (channel: string, payload: any) =>
  pubRedis.publish(channel, JSON.stringify(payload));

export const subscribe = (
  channel: string,
  handler: (data: any) => void
) => {
  subRedis.subscribe(channel);
  subRedis.on("message", (_, msg) => handler(JSON.parse(msg)));
};
