// Event

export const SOCKET_EVENTS = {
  // Connection events
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Chat events
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",
  MESSAGE_READ: "message_read",

  // Notification events
  NOTIFICATION: "notification",
  NOTIFICATION_READ: "notification_read",

  // User events
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  USER_TYPING: "user_typing",
} as const;

export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
  MENTION: "mention",
  MESSAGE: "message",
  POST: "post",
  STORY: "story",
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Roles

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_HIERARCHY = {
  [USER_ROLES.USER]: 1,
  [USER_ROLES.MODERATOR]: 2,
  [USER_ROLES.ADMIN]: 3,
} as const;

// status

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  FAIL: "fail",
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS];

