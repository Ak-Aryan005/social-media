import { Router } from "express";
import * as likeController from "../controllers/like.controller";
import { authenticate } from "../../../middleware/checkJwt";

const router = Router();

// router.post("/", authenticate, likeController.toggleLike);
// router.get("/:targetType/:targetId", authenticate, likeController.getLikes);
// router.get("/:targetType/:targetId/check", authenticate, likeController.checkLike);


router.post("/", authenticate, likeController.createLike);
router.patch("/", authenticate, likeController.removeLike);
router.get("/",  likeController.getLikes);

export default router;
