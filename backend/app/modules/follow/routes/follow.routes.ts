import { Router } from "express";
import * as followController from "../controllers/follow.controller";
import { authenticate } from "../../../middleware/checkJwt";

const router = Router();

router.get("/followers", authenticate, followController.getFollowers);
router.get("/following", authenticate, followController.getFollowing);
router.get("/anothers-followers/:id", authenticate, followController.anothersFollowers);
router.get("/anothers-following/:id", authenticate, followController.anothersFollowing);
router.post("/", authenticate, followController.followUser);
router.delete("/", authenticate, followController.unfollowUser);
// router.get("/:userId/followers", authenticate, followController.getFollowers);
// router.get("/:userId/following", authenticate, followController.getFollowing);
// router.get("/:userId/check", authenticate, followController.checkFollow);

export default router;
