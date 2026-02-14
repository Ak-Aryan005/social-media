import { Server, Socket } from "socket.io";
import { io } from "../index";
import Notification, { INotification } from "../modules/notification/notification.model";

interface NotificationPayload {
  _id:string;
  type: "like" | "comment" | "follow" | "message";
    user: string;
    title: string;
    relatedUser?: string;
    relatedPost?: string;
    relatedComment?: string;
    isRead: boolean;
    createdAt: Date;
}



export const initializeNotificationGateway = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log("🔔 Notification socket connected:", socket.id);

    socket.on("join-notifications", (userId: string) => {
      console.log("📌 Joining notification room:", userId);
      socket.join(`notify:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔕 Notification socket disconnected:", socket.id);
    });
  });
};




export const notifyUser = async (data:any) => {
  const notification = await Notification.create(data);
console.log(`noty${notification}`)
  io.to(`notify:${data.user}`).emit("notification", {
    _id: notification._id,
    ...data,
    createdAt: notification.createdAt,
  });

  return notification;
};
