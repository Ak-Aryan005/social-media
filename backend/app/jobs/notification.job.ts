import { notificationQueue } from "./queue";
import { logger } from "../config/logger";

notificationQueue.process(async (job) => {
  const { userId, title, message, data } = job.data;

  try {
    logger.info(`Processing notification for user ${userId}`);
    logger.info(`Notification -> ${title}: ${message}`);
    return { success: true };
  } catch (error: any) {
    logger.error(`Notification failed for ${userId}: ${error.message}`);
    throw error;
  }
});

// Add notification to queue
export const addNotificationJob = async (data: any) =>
  notificationQueue.add(data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  });
