import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { getUserValidation, updateUserValidation } from "../validations/user.validation";
import { authenticate } from "../../../middleware/checkJwt";
import  {validate}  from "../../../middleware/validation";
import {upload} from "../../../middleware/multer"

const router = Router();

router.get("/", authenticate, userController.getUsersList);
router.get("/profile", authenticate, userController.userProfile);
router.get("/profile/:id", authenticate, userController.anotherUserProfile);
router.get("/search", authenticate, userController.searchUsers);
router.get("/me", authenticate, userController.getUserByToken);
router.get("/:userId", authenticate,validate(getUserValidation), userController.getUserById);
router.patch("/me", authenticate, validate(updateUserValidation), userController.updateMe);
router.patch("/deactivateUser", authenticate, userController.deactivateUser);
router.post("/add-profile-picture",authenticate,upload,userController.addAndUpdateProfilePicture)
router.post("/block-user/:id",authenticate,userController.blockUser)
router.post("/unblock-user/:id",authenticate,userController.unBlockUser)


export default router;
