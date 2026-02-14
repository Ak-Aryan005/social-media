import { emailQueue } from "./queue";
import { logger } from "../config/logger";
import { sendEmail } from "../utils/mail";

emailQueue.process(async (job) => {
  const emailData = job.data;

  try {
    logger.info(`Processing email job for ${emailData.to}`);
    await sendEmail(emailData);
    logger.info(`Email sent successfully to ${emailData.to}`);
    return { success: true };
  } catch (error: any) {
    logger.error(`Error sending email to ${emailData.to}: ${error.message}`);
    throw error;
  }
});

// Add email to queue
export const addEmailJob = async (data: any) =>
  emailQueue.add(data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  });
