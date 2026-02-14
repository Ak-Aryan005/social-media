import Admin, { IAdmin } from "./admin.model";
import User from "../user/models/user.model";
import { ApiError } from "../../utils/apiResponse";
import httpStatus from "http-status";

export const createAdmin = async (adminData: Partial<IAdmin>): Promise<IAdmin> => {
  const user = await User.findById(adminData.user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return Admin.create(adminData);
};

export const getAdminById = async (id: string): Promise<IAdmin | null> => {
  return Admin.findById(id).populate("user", "username fullName email avatar");
};

export const getAdminByUserId = async (userId: string): Promise<IAdmin | null> => {
  return Admin.findOne({ user: userId }).populate("user", "username fullName email avatar");
};

export const updateAdminById = async (
  adminId: string,
  updateData: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const admin = await Admin.findByIdAndUpdate(adminId, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "username fullName email avatar");
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return admin;
};

export const deleteAdminById = async (adminId: string): Promise<void> => {
  const admin = await Admin.findByIdAndDelete(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
};

export const getAllAdmins = async (options: any) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const filter = {};
  
  const admins = await Admin.find(filter)
    .populate("user", "username fullName email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Admin.countDocuments(filter);
  
  return {
    data: admins,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const hasPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  const admin = await Admin.findOne({ user: userId });
  if (!admin) {
    return false;
  }
  if (admin.isSuperAdmin) {
    return true;
  }
  return admin.permissions.includes(permission);
};

