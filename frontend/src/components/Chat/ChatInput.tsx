import { useState, useRef } from "react";
import { getSocket } from "@/socket/socket";
import { SendHorizontal, Image } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux";
import { uploadChatMedia } from "@/redux/slices/chatSlice";

interface ChatInputProps {
  chatId?: string;
  receiverId?: string; // only for first-time message
  navigate: (path: string) => void;
}

export default function ChatInput({
  chatId,
  receiverId,
  navigate,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useAppDispatch();
  const socket = getSocket();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ================= SEND TEXT MESSAGE =================
  const sendMessage = () => {
    if (!message.trim()) return;
    if (!socket || !socket.connected) return;
    if (isUploading) return; // prevent sending while uploading

    socket.emit(
      "send-message",
      {
        chatId,
        receiverId,
        content: message,
      },
      (res: any) => {
        if (res?.error) {
          console.error("Send message failed:", res.error);
          return;
        }

        // First-time message navigation
        if (!chatId && res?.chatId) {
          navigate(`/chat/${res.chatId}`);
        }
      }
    );

    setMessage("");
  };

  // ================= SEND MEDIA =================
  const handleSendMedia = async (file: File) => {
    if (!socket || !socket.connected) return;

    try {
      setIsUploading(true);

      const media = await dispatch(uploadChatMedia(file)).unwrap();

      let content: string | null = null;
      if (media?.type === "image") content = "sent an image";
      else if (media?.type === "video") content = "sent a video";
      else if (media?.type === "audio") content = "sent an audio";

      socket.emit(
        "send-message",
        {
          chatId,
          receiverId,
          content,
          media, // { url, type }
        },
        (res: any) => {
          if (res?.error) {
            console.error("Send message failed:", res.error);
          }

          if (!chatId && res?.chatId) {
            navigate(`/chat/${res.chatId}`);
          }
        }
      );
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // ================= FILE SELECT =================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleSendMedia(file);
    e.target.value = ""; // reset input
  };

  return (
    <div className="border-t p-3">
      {/* Uploading Indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          Uploading media...
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border px-3 py-2">
        {/* Media Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-gray-500 hover:text-black disabled:opacity-50"
        >
          <Image size={20} />
        </button>

        {/* Text Input */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          disabled={isUploading}
          className="flex-1 bg-transparent outline-none text-sm disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={!message.trim() || isUploading}
          className={`${
            message.trim() && !isUploading
              ? "text-blue-500 hover:text-blue-600"
              : "text-gray-400"
          }`}
        >
          <SendHorizontal size={20} />
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileSelect}
      />
    </div>
  );
}
