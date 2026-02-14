import { Router } from "express";
import * as likeController from "../controllers/like.controller";
import { authenticate } from "../../../middleware/checkJwt";

const router = Router();




router.post("/", authenticate, likeController.createLike);
router.patch("/", authenticate, likeController.removeLike);
router.get("/",  likeController.getLikes);

export default router;
