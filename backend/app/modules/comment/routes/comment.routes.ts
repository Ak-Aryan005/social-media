import { Router } from "express";
import * as commentController from "../controllers/comment.controller";
import { authenticate } from "../../../middleware/checkJwt";

const router = Router();

router.post("/", authenticate, commentController.createComment);
router.patch("/", authenticate, commentController.updateComment);
router.get("/:id",  commentController.getComments);
router.delete("/", authenticate, commentController.deleteComment);


export default router;
