import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubRedis, subRedis } from "../config/redis";

export const initializeSocket = (httpServer: any): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // restrict in prod
    },
  });

  io.adapter(createAdapter(pubRedis, subRedis));

  return io;
};
