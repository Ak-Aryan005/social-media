import { Server, Socket } from "socket.io";
import { saveMessage } from "../redis/messaging";

interface SendMessagePayload {
  roomId: string;
  from: string;
  to: string;
  text: string;
}

export const chatSocket = (io: Server, socket: Socket): void => {
  socket.on("send-message", async (data: SendMessagePayload) => {
    await saveMessage(data.roomId, data.from, data.to, data.text);

    io.to(`user:${data.to}`).emit("message", data);
  });
};
