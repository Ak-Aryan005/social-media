import express, { Express } from "express";
import * as bodyParser from "body-parser";
// import * as cors from "cors";
// import cors from 'cors'
import httpStatus from "http-status";
import config from "./config/config";
import * as morgan from "./config/morgan";
import { errorConverter, errorHandler } from "./middleware/error";
import { ApiError } from "./utils/apiResponse";
import database from "./config/db";
import { join } from "path";
import rateLimit from "express-rate-limit";
import routes from "./modules/index";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";
// import { cacheMiddleware } from "./middlewares/cache.middleware";
// import { cacheInvalidation } from "./middlewares/cache-invalidation.middleware";
import {agenda} from './config/agenda'
import "./jobs/agenda.job"; // load job definitions
import {stripeSubscriptionHookHandler} from './modules/subscription/payment'

database();
(async () => {
  await agenda.start();
  console.log("Agenda started");
})();

// GRACEFUL SHUTDOWN
process.on("SIGTERM", async () => {
  console.log("Stopping Agenda...");
  await agenda.stop();
  process.exit(0);
});




export const app: Express = express();
app.post(
  "/api/webhooks/stripe/subscription",
  express.raw({ type: "application/json" }),
  stripeSubscriptionHookHandler
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Request logging
if (config.nodeEnv !== "test") {
 app.use(morgan.successHandler);
 app.use(morgan.errorHandler);
}

// View engine
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Healthcheck
app.use("/_healthcheck", async (_req, res) => {
 const _healthCheck: any = {
 uptime: process.uptime(),
 message: "OK",
 timestamp: Date.now(),
 };
 try {
 res.send(_healthCheck);
 } catch (error) {
 _healthCheck.message = error;
 res.status(503).send();
 }
});
app.set('trust proxy', 1); 
// -----------------------------
//  Global Rate Limiter
// -----------------------------
const globalLimiter = rateLimit({
  skip: (req) => req.method === 'OPTIONS',
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per window
 standardHeaders: true, // return rate limit info in headers
 legacyHeaders: false, // disable deprecated headers
 message: {
 status: 429,
 error: true,
 message: "Too many requests, please try again later.",
 },
});

// Apply rate-limiter globally
app.use(globalLimiter);

// -----------------------------

// Enable CORS
// app.use(cors.default());

import cors, { CorsOptions } from "cors";

const allowedOrigins: string[] = [
  "http://localhost:5173", // Vite
  "http://localhost:8080", // CRA
  "social-media-epf4lxeng-ak-aryan005s-projects.vercel.app"
];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // allow requests with no origin (like Postman, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cors({
  origin:"*",
    credentials: true,
}));
// -----------------------------
// ✅ Redis Cache Middleware
// -----------------------------
// Apply cache middleware to all GET requests
// app.use(cacheMiddleware);

// Apply cache invalidation to all mutation requests
// app.use(cacheInvalidation);

// -----------------------------
// ✅ Swagger Documentation
// -----------------------------

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Social Media API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
}));

// Swagger JSON endpoint
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Load routes
routes(app);

// 404 handler
const handleNotFound = (
 req: express.Request,
 res: express.Response,
 next: express.NextFunction
) => {
 next(new ApiError(httpStatus.NOT_FOUND, "API path not found"));
};

app.use(handleNotFound);

// Error handler middleware
app.use((
 err: any,
 req: express.Request,
 res: express.Response,
 next: express.NextFunction
) => {
 const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
 const message = err.message || "Internal Server Error";
 res.status(statusCode).json({ message, status: statusCode, error: true });
});

// convert error to ApiError
app.use(errorConverter);

// error handler
app.use(errorHandler);

export default app;