import { Router } from "express";
import * as reelController from "../controllers/reel.controller";
import { authenticate } from "../../../middleware/checkJwt";
import { upload } from "../../../middleware/multer";

const router = Router();

router.post("/", authenticate,upload, reelController.createReel);
router.get("/", authenticate, reelController.getReels);
router.get("/:reelId", authenticate, reelController.getReel);
router.get("/user/:userId", authenticate, reelController.getUserReels);
router.patch("/:reelId", authenticate, reelController.updateReel);
router.delete("/:reelId", authenticate, reelController.deleteReel);

export default router;
