import { upload } from './../../middleware/multer';
import * as chatservice  from './chat.service';
import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../utils/apiResponse";
// import { getPaginationOptions } from "../../../utils/pagination";
import { asyncHandler } from "../../middleware/async";
import { chatSocket } from 'sockets/chat.socket';
// import { Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendSuccess, sendCreated } from "../../utils/response";
// import { getPaginationOptions } from "../../utils/pagination";
// import * as chatService from "./chat.service";
// import { authenticate } from "../../middlewares/auth.middleware";
// import { AuthRequest } from "../../middlewares/auth.middleware";

// export const createChat = catchAsync(async (req: AuthRequest, res: Response) => {
//   const chatData = {
//     ...req.body,
//     participants: [...(req.body.participants || []), req.user!.id],
//   };
//   const chat = await chatService.createChat(chatData);
//   sendCreated(res, chat, "Chat created successfully");
// });

// export const getChats = catchAsync(async (req: AuthRequest, res: Response) => {
//   const chats = await chatService.getUserChats(req.user!.id);
//   sendSuccess(res, chats, "Chats retrieved successfully");
// });

// export const getChat = catchAsync(async (req: Request, res: Response) => {
//   const chat = await chatService.getChatById(req.params.chatId);
//   if (!chat) {
//     return res.status(404).json({ message: "Chat not found", status: 404, error: true });
//   }
//   sendSuccess(res, chat, "Chat retrieved successfully");
// });

// export const createMessage = catchAsync(async (req: AuthRequest, res: Response) => {
//   const messageData = {
//     ...req.body,
//     sender: req.user!.id,
//   };
//   const message = await chatService.createMessage(messageData);
//   sendCreated(res, message, "Message sent successfully");
// });

// export const getMessages = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const result = await chatService.getMessagesByChat(req.params.chatId, options);
//   sendSuccess(res, result.data, "Messages retrieved successfully", result.meta);
// });

// export const markAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
//   await chatService.markChatAsRead(req.params.chatId, req.user!.id);
//   sendSuccess(res, null, "Chat marked as read");
// });


interface AuthRequest extends Request {
  user?: any; 
}


export const chatList = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.chatList(req.user);
  sendSuccess(res, chat, "chatlist fetched successfully");
});

export const getChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.getChat(req.params.chatId);
  sendSuccess(res, chat, "chatlist fetched successfully");
});

export const uploadmedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.uploadChatMedia(req.files as Express.Multer.File[]);
  sendSuccess(res, chat, "media added successfully");
});