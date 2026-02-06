import { Router } from "express";
import * as commentController from "../controllers/comment.controller";
import { authenticate } from "../../../middleware/checkJwt";

const router = Router();

router.post("/", authenticate, commentController.createComment);
router.patch("/", authenticate, commentController.updateComment);
router.get("/:id",  commentController.getComments);
router.delete("/", authenticate, commentController.deleteComment);
// router.get("/post/:postId", authenticate, commentController.getComments);
// router.get("/:commentId", authenticate, commentController.getComment);
// router.patch("/:commentId", authenticate, commentController.updateComment);
// router.delete("/:commentId", authenticate, commentController.deleteComment);
// router.get("/:commentId/replies", authenticate, commentController.getReplies);

export default router;
