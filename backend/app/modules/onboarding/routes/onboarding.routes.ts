import { Router } from "express";
import * as onboardingController from "../controllers/onboarding.controller";
import { authenticate } from "../../../middleware/checkJwt";
import { validate } from "../../../middleware/validation";
import {
  updateProfileValidation,
  updateInterestsValidation,
  updateFollowSuggestionsValidation,
} from "../validation/onboarding.validation";

const router = Router();

// All onboarding routes require authentication
router.use(authenticate);

router.get("/status", onboardingController.getStatus);
router.get("/suggestions", onboardingController.getSuggestions);
router.post("/profile", validate(updateProfileValidation), onboardingController.updateProfile);
router.post("/interests", validate(updateInterestsValidation), onboardingController.updateInterests);
router.post(
  "/follow-suggestions",
  validate(updateFollowSuggestionsValidation),
  onboardingController.updateFollowSuggestions
);
router.post("/complete", onboardingController.complete);
router.post("/skip", onboardingController.skip);

export default router;

