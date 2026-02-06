import { Express } from "express";
import authRoutes from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/user/routes/user.routes";
import postRoutes from "./post/routes/post.routes";
import commentRoutes from "./comment/routes/comment.routes";
import likeRoutes from "./like/routes/like.routes";
import followRoutes from "./follow/routes/follow.routes";
import storyRoutes from "../modules/story/story.routes";
import reelRoutes from "./reel/routes/reel.routes";
import chatRoutes from "../modules/chat/chat.routes";
import notificationRoutes from "../modules/notification/notification.routes";
import adminRoutes from "../modules/admin/admin.routes";
import onboardingRoutes from "../modules/onboarding/routes/onboarding.routes";
import subscriptionRoutes from "../modules/subscription/routes/sub.routes"
const routes = (app: Express) => {
  const apiVersion = "/api/v1";

  // Auth routes
  app.use(`${apiVersion}/auth`, authRoutes);

  // User routes
  app.use(`${apiVersion}/users`, userRoutes);

  // Post routes
  app.use(`${apiVersion}/posts`, postRoutes);

  // Comment routes
  app.use(`${apiVersion}/comments`, commentRoutes);

  // Like routes
  app.use(`${apiVersion}/likes`, likeRoutes);

  // Follow routes
  app.use(`${apiVersion}/follows`, followRoutes);

  // Story routes
  app.use(`${apiVersion}/stories`, storyRoutes);

  // Reel routes
  app.use(`${apiVersion}/reels`, reelRoutes);

  // Chat routes
  app.use(`${apiVersion}/chats`, chatRoutes);

  // Notification routes
  app.use(`${apiVersion}/notifications`, notificationRoutes);

  // Admin routes
//   app.use(`${apiVersion}/admin`, adminRoutes);

  // Onboarding routes
//   app.use(`${apiVersion}/onboarding`, onboardingRoutes);
  app.use(`${apiVersion}/subscription`, subscriptionRoutes);
};

export default routes;

