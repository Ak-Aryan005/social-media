import { Router } from "express";
import * as chatController from "./chat.controller";
import { authenticate } from "../../middleware/checkJwt";
import { upload } from "../../middleware/multer";

const router = Router();


router.get("/chatlist", authenticate, chatController.chatList);
router.get("/messages/:chatId", authenticate, chatController.getChat);
router.post("/upload", authenticate, upload,chatController.uploadmedia);
router.post("/create-group", authenticate,chatController.createGroup);
router.get("/users-list",authenticate,chatController.getUsersListForGroup)
router.get("/group-list", authenticate, chatController.getGroupList);
router.get("/group-members/:chatId", authenticate, chatController.getGroupMembers);
router.post("/update-group/",authenticate, upload,chatController.updateGroup);
router.post("/leave-group/:chatId", authenticate, chatController.leaveGroup);
router.post("/remove-members/:chatId", authenticate, chatController.removeMembers);
router.post("/make-admin/:chatId", authenticate, chatController.makeAdmin);
router.post("/add-members/:chatId", authenticate, chatController.addmembers);

export default router;
