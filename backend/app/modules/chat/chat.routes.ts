import { Router } from "express";
import * as chatController from "./chat.controller";
import { authenticate } from "../../middleware/checkJwt";
import { upload } from "../../middleware/multer";

const router = Router();

// router.post("/", authenticate, chatController.createChat);
// router.get("/", authenticate, chatController.getChats);
// router.get("/:chatId", authenticate, chatController.getChat);
// router.post("/:chatId/messages", authenticate, chatController.createMessage);
// router.get("/:chatId/messages", authenticate, chatController.getMessages);
// router.post("/:chatId/read", authenticate, chatController.markAsRead);
router.get("/chatlist", authenticate, chatController.chatList);
router.get("/messages/:chatId", authenticate, chatController.getChat);
router.post("/upload", authenticate, upload,chatController.uploadmedia);

export default router;
