import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ApiError } from "../utils/apiResponse";
import { verifyToken } from "../utils/jwt";
import config from "../config/config";
import { Socket } from "socket.io";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    phone?:string,
    password:string,
    role: string;
    avatar:string;
    username:string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const decoded = verifyToken(token, config.jwt.secret);
    req.user = decoded as AuthRequest["user"];
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Token expired"));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to perform this action"
        )
      );
      return;
    }

    next();
  };
};


export interface JwtUser {
  id: string;
  email: string;
  role: string;
}

declare module "socket.io" {
  interface Socket {
    user?: JwtUser;
  }
}

export const socketAuthenticate = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    let token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    // 🔥 Handle "Bearer <token>"
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = verifyToken(token) as {
      id: string;
      email: string;
      role: string;
    };

    socket.user = decoded; // ✅ attach user to socket

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
