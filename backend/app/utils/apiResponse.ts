export class ApiError extends Error {
  statusCode: number;
  error: boolean;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = ""
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.error = true;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

import { Response } from "express";
import httpStatus from "http-status";

export interface ApiResponse<T = any> {
  status: string;
  statusCode: number;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  meta?: ApiResponse<T>["meta"]
): Response => {
  const response: ApiResponse<T> = {
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
    statusCode,
    ...(message && { message }),
    ...(data && { data }),
    ...(meta && { meta }),
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  meta?: ApiResponse<T>["meta"]
): Response => {
  return sendResponse(res, httpStatus.OK, data, message, meta);
};

export const sendCreated = <T>(
  res: Response,
  data?: T,
  message?: string
): Response => {
  return sendResponse(res, httpStatus.CREATED, data, message);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(httpStatus.NO_CONTENT).send();
};

