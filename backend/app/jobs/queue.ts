import Queue from "bull";
import config from "../config/config";
import { logger } from "../config/logger";

// Redis connection using URL
const redisConfig = {
  redis: config.redis.url,
};

// Create queues
export const emailQueue = new Queue("email", redisConfig);
export const notificationQueue = new Queue("notification", redisConfig);

// Queue Event Handlers
emailQueue.on("completed", (job) => {
  logger.info(`Email job ${job.id} completed`);
});
emailQueue.on("failed", (job, err) => {
  logger.error(`Email job ${job?.id} failed: ${err.message}`);
});

notificationQueue.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed`);
});
notificationQueue.on("failed", (job, err) => {
  logger.error(`Notification job ${job?.id} failed: ${err.message}`);
});
