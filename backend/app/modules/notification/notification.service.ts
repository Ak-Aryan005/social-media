import Notification, { INotification } from "./notification.model";
import { ApiError } from "../../utils/apiResponse";
import httpStatus from "http-status";

export const createNotification = async (
  notificationData: Partial<INotification>
): Promise<INotification> => {
  return Notification.create(notificationData);
};

export const getNotificationById = async (id: string): Promise<INotification | null> => {
  return Notification.findById(id)
    .populate("user", "username fullName avatar")
    .populate("relatedUser", "username fullName avatar")
    .populate("relatedPost")
    .populate("relatedComment");
};

export const getUserNotifications = async (userId: string, options: any) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;
  const filter = { user: userId };
  
  const notifications = await Notification.find(filter)
    .populate("relatedUser", "username fullName avatar")
    .populate("relatedPost")
    .populate("relatedComment")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  // console.log(`not ${notifications}`)
  const total = await Notification.countDocuments(filter);
  
  return {
    data: notifications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return Notification.countDocuments({ user: userId, isRead: false });
};

export const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }
  return notification;
};

