import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { sendSuccess } from "../../utils/apiResponse";
import { getPaginationOptions } from "../../utils/pagination";
import * as notificationService from "./notification.service";
import { AuthRequest } from "../../middleware/checkJwt";

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const options = getPaginationOptions(req.query);
  const result = await notificationService.getUserNotifications(req.user!.id, options);
  sendSuccess(res, result.data, "Notifications retrieved successfully", result.meta);
});

export const getNotification = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  if (!notification) {
     res.status(404).json({ message: "Notification not found", status: 404, error: true });
  }
  sendSuccess(res, notification, "Notification retrieved successfully");
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await notificationService.markAsRead(req.params.notificationId, req.user!.id);
  sendSuccess(res, notification, "Notification marked as read");
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await notificationService.markAllAsRead(req.user!.id);
  sendSuccess(res, null, "All notifications marked as read");
});

export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const count = await notificationService.getUnreadCount(req.user!.id);
  sendSuccess(res, { count }, "Unread count retrieved successfully");
});

export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  await notificationService.deleteNotification(req.params.notificationId, req.user!.id);
  sendSuccess(res, null, "Notification deleted successfully");
});
