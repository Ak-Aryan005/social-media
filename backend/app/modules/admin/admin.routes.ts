import { Router } from "express";
import * as adminController from "./admin.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../../constants/roles";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

router.post("/", adminController.createAdmin);
router.get("/", adminController.getAdmins);
router.get("/:adminId", adminController.getAdmin);
router.patch("/:adminId", adminController.updateAdmin);
router.delete("/:adminId", adminController.deleteAdmin);

export default router;
