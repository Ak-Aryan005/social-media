import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ApiError } from "../utils/apiResponse";
import { logger } from "../config/logger";
import config from "../config/config";

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode, message } = err;

  if (config.nodeEnv === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR] || "Internal Server Error");
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  };

  if (config.nodeEnv === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

