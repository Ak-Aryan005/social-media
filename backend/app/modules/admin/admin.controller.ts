import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { sendSuccess, sendCreated } from "../../utils/apiResponse";
import { getPaginationOptions } from "../../utils/pagination";
import * as adminService from "./admin.service";
import { AuthRequest } from "../../middleware/checkJwt";

export const createAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await adminService.createAdmin(req.body);
  sendCreated(res, admin, "Admin created successfully");
});

export const getAdmins = asyncHandler(async (req: Request, res: Response) => {
  const options = getPaginationOptions(req.query);
  const result = await adminService.getAllAdmins(options);
  sendSuccess(res, result.data, "Admins retrieved successfully", result.meta);
});

export const getAdmin = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.getAdminById(req.params.adminId);
  if (!admin) {
     res.status(404).json({ message: "Admin not found", status: 404, error: true });
  }
  sendSuccess(res, admin, "Admin retrieved successfully");
});

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.updateAdminById(req.params.adminId, req.body);
  sendSuccess(res, admin, "Admin updated successfully");
});

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteAdminById(req.params.adminId);
  sendSuccess(res, null, "Admin deleted successfully");
});
