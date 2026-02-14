import { Server } from "socket.io";
import { initializeChatGateway } from "./chat.gateway";
import { initializeNotificationGateway } from "./notification.gateway";

export const registerGateways = (io: Server) => {
  initializeChatGateway(io);
  initializeNotificationGateway(io);
};
