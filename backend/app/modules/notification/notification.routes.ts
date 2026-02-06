import { Router } from "express";
import * as notificationController from "./notification.controller";
import { authenticate } from "../../middleware/checkJwt";

const router = Router();

router.get("/", authenticate, notificationController.getNotifications);
router.get("/unread-count", authenticate, notificationController.getUnreadCount);
router.get("/:notificationId", authenticate, notificationController.getNotification);
router.patch("/:notificationId/read", authenticate, notificationController.markAsRead);
router.patch("/read-all", authenticate, notificationController.markAllAsRead);
router.delete("/:notificationId", authenticate, notificationController.deleteNotification);

export default router;
