import { upload } from './../../middleware/multer';
import * as chatservice  from './chat.service';
import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../utils/apiResponse";
import { asyncHandler } from "../../middleware/async";
import { chatSocket } from 'sockets/chat.socket';

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

export const createGroup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.createGroup(req.body,req.user);
  sendSuccess(res, chat, "group created successfully");
});

export const getUsersListForGroup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.getUsersListForGroup(req.user);
  sendSuccess(res, chat, "users fetched successfully");
});

export const getGroupList = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.getGroupList(req.user);
  sendSuccess(res, chat, "chatlist fetched successfully");
});

export const getGroupMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.getGroupMembers(req.params.chatId);
  sendSuccess(res, chat, "chatlist fetched successfully");
});

export const updateGroup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.updateGroup(req.user,req.body,req.files as Express.Multer.File[]);
  sendSuccess(res, chat, "chatlist fetched successfully");
});

export const removeMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userIds } = req.body;
  const chat = await chatservice.removeMembers(req.params.chatId,userIds,req.user);
  sendSuccess(res, chat, "chatlist fetched successfully");
});

export const leaveGroup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.leaveGroup(req.params.chatId,req.user);
  sendSuccess(res, chat, "leave group successfully");
});
  

export const addmembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.addMembers(req.params.chatId,req.body,req.user);
  sendSuccess(res, chat, "leave group successfully");
});

export const makeAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatservice.makeAdmin(req.params.chatId,req.body.newAdminId,req.user);
  sendSuccess(res, chat, "leave group successfully");
});
