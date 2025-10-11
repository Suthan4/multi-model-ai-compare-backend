export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  TOO_MANY_REQUEST: 429,
};

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  AI_RESPONSE: "ai_response",
};

export const MESSAGE_TYPES = {
  TEXT: "text",
  AI_GENERATED: "ai_generated",
  SYSTEM: "system",
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",
  ROOM_NOT_FOUND: "Room not found",
  MESSAGE_NOT_FOUND: "Message not found",
  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Internal server error",
};
