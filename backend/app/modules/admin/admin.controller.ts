import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess, sendCreated } from "../../utils/response";
import { getPaginationOptions } from "../../utils/pagination";
import * as adminService from "./admin.service";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../../constants/roles";

export const createAdmin = catchAsync(async (req: AuthRequest, res: Response) => {
  const admin = await adminService.createAdmin(req.body);
  sendCreated(res, admin, "Admin created successfully");
});

export const getAdmins = catchAsync(async (req: Request, res: Response) => {
  const options = getPaginationOptions(req.query);
  const result = await adminService.getAllAdmins(options);
  sendSuccess(res, result.data, "Admins retrieved successfully", result.meta);
});

export const getAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await adminService.getAdminById(req.params.adminId);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found", status: 404, error: true });
  }
  sendSuccess(res, admin, "Admin retrieved successfully");
});

export const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await adminService.updateAdminById(req.params.adminId, req.body);
  sendSuccess(res, admin, "Admin updated successfully");
});

export const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  await adminService.deleteAdminById(req.params.adminId);
  sendSuccess(res, null, "Admin deleted successfully");
});
