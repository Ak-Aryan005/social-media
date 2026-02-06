import jwt from "jsonwebtoken";
import config from "../config/config";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpirationMinutes}m`,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: `${config.jwt.refreshExpirationDays}d`,
  });
};

export const generateResetPasswordToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: `${config.jwt.resetPasswordExpirationMinutes}m`,
  });
};

export const generateVerifyEmailToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: `${config.jwt.verifyEmailExpirationMinutes}m`,
  });
};

export const verifyToken = (token: string, secret: string = config.jwt.secret): TokenPayload => {
  return jwt.verify(token, secret) as TokenPayload;
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

