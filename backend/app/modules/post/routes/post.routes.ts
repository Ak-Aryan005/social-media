import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { authenticate } from "../../../middleware/checkJwt";
import { validate } from "../../../middleware/validation";
import { createPostValidation, updatePostValidation, getPostValidation } from "../validators/post.validation";
import {upload} from "../../../middleware/multer"
const router = Router();

router.post("/", authenticate, upload, postController.createPost);
router.get("/", authenticate,  postController.homePage);
router.get("/getUserPosts", authenticate,  postController.getUserPosts);
router.get("/getUserPosts/:id", authenticate,  postController.getAnotherUserPost);
router.patch("/:postId", authenticate,upload, postController.updatePost);
router.get("/:postId", authenticate,validate(getPostValidation),postController.getPostById);
router.delete("/:postId", authenticate, validate(getPostValidation), postController.deletePost);
router.patch("/deleteImage/:postId", authenticate, validate(getPostValidation), postController.deleteImageOfPost);

export default router;
