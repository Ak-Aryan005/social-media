import { Router } from "express";
import * as storyController from "./story.controller";
import { authenticate } from "../../middleware/checkJwt";
import { upload } from "../../middleware/multer";

const router = Router();

router.post("/", authenticate,upload, storyController.createStory);
router.get("/", authenticate, storyController.getStories);
router.get("/user/:userId", authenticate, storyController.getUserStories);
router.get("/:storyId", authenticate, storyController.getStory);
router.post("/:storyId/view", authenticate, storyController.viewStory);
router.delete("/:storyId", authenticate, storyController.deleteStory);

export default router;
