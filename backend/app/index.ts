import { createServer } from "http";
import {app} from "./app";
import config from "./config/config";
import { logger } from "./config/logger";
import { initializeSocket } from "./sockets/socket";
import mongoose from "mongoose";
import redisClient, { pubRedis, subRedis } from "./config/redis";
import { registerGateways } from "./sockets";

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
export const io = initializeSocket(httpServer);

// Initialize Chat Gateway
// initializeChatGateway(io);
registerGateways(io);

// Start server
const server = httpServer.listen(
  config.server.port,
  config.server.host,
  () => {
    logger.info(
      `🚀 Server running on http://${config.server.host}:${config.server.port}`
    );
    logger.info("📡 Socket.IO server initialized");
  }
);

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  const shutdownTimeout = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);

  server.close(async () => {
    logger.info("HTTP server closed");

    // Close Socket.IO
    try {
      io.close(() => {
        logger.info("Socket.IO server closed");
      });
    } catch (error: any) {
      logger.error(`Error closing Socket.IO: ${error.message}`);
    }

    // Close MongoDB
    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
    } catch (error: any) {
      logger.error(`Error closing MongoDB: ${error.message}`);
    }

    // Close Redis main client
    try {
      await redisClient?.quit();
      logger.info("Redis connection closed");
    } catch (error: any) {
      logger.error(`Error closing Redis: ${error.message}`);
    }

    // 🔥 Close Redis pub/sub (REQUIRED for Socket.IO adapter)
    try {
      await pubRedis?.quit();
      await subRedis?.quit();
      logger.info("Redis pub/sub connections closed");
    } catch (error: any) {
      logger.error(`Error closing Redis pub/sub: ${error.message}`);
    }

    clearTimeout(shutdownTimeout);
    logger.info("Graceful shutdown completed");
    process.exit(0);
  });

  // Force close if server hangs
  setTimeout(() => {
    logger.error("Forcing server close");
    process.exit(1);
  }, 5000);
};

// Handle signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unexpected errors
const unexpectedErrorHandler = (error: any) => {
  logger.error("Uncaught exception:", error);
  gracefulShutdown("unexpectedError");
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
