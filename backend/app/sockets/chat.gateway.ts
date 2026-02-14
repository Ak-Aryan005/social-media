import { chatSocket } from "../modules/chat/chat.gateway";
import { Server, Socket } from "socket.io";
import { socketAuthenticate } from "../middleware/checkJwt";
export const initializeChatGateway = (io: Server) => {
  io.use(socketAuthenticate);

  io.on("connection", (socket: Socket) => {

    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    // socket.on("send-message", (data) => {
    //   io.to(`user:${data.to}`).emit("message", data);
    // });
chatSocket(io,socket)
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};






