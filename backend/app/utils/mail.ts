import nodemailer from "nodemailer";
import config from "../config/config";
import { logger } from "../config/logger";
import ejs from "ejs";
import { readFileSync } from "fs";
import { join } from "path";

let transporter: nodemailer.Transporter | null = null;

// Initialize Nodemailer Transporter
try {
  if (config.smtp.user && config.smtp.pass) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass, // App password
      },
    });
    logger.info("Gmail transporter initialized successfully");
  } else {
    logger.warn("Gmail credentials not provided. Email features will be disabled.");
  }
} catch (error: any) {
  logger.error(`Error initializing Email service: ${error.message}`);
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  data?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    data: Buffer | string;
  }>;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!transporter) {
    logger.error("Nodemailer Gmail NOT initialized");
    throw new Error("Email service not configured");
  }

  try {
    const { to, subject, template, data, html, text, attachments } = options;

    let emailHtml = html;

    // Render template if provided
    if (template) {
    const templatePath = join(process.cwd(), "bin", "views", `${template}.ejs`);
      const templateContent = readFileSync(templatePath, "utf8");
      emailHtml = ejs.render(templateContent, {
        ...data,
        baseUrl: config.server.baseUrl,
      });
    }

    const mailOptions: any = {
      from: config.smtp.user,
      to,
      subject,
      ...(emailHtml && { html: emailHtml }),
      ...(text && { text }),
      ...(attachments && { attachments }),
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
    return true;
  } catch (error: any) {
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

export const sendVerificationEmail = async (
  to: string,
  username: string,
  verificationToken: string
): Promise<boolean> => {
  const verificationUrl = `${config.server.baseUrl}/api/v1/auth/verify-email?token=${verificationToken}`;

  return sendEmail({
    to,
    subject: "Verify Your Email Address",
    template: "verify-email",
    data: {
      username,
      verificationUrl,
      verificationCode: verificationToken.substring(0, 6),
      expirationMinutes: config.jwt.verifyEmailExpirationMinutes,
    },
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  username: string,
  resetToken: string
): Promise<boolean> => {
  const resetUrl = `${config.server.baseUrl}/api/v1/auth/reset-password?token=${resetToken}`;

  return sendEmail({
    to,
    subject: "Reset Your Password",
    template: "reset-password",
    data: {
      username,
      resetUrl,
      resetCode: resetToken.substring(0, 6),
      expirationMinutes: config.jwt.resetPasswordExpirationMinutes,
    },
  });
};

export const sendWelcomeEmail = async (to: string, username: string): Promise<boolean> => {
  return sendEmail({
    to,
    subject: "Welcome to Social Media!",
    template: "verify-email",
    data: { username, message: "Welcome to our platform!" },
  });
};
