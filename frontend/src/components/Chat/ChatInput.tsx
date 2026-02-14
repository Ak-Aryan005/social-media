import { useState,useRef } from "react";
import { getSocket } from "@/socket/socket";
import { SendHorizontal,Image } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux";
import { uploadChatMedia } from "@/redux/slices/chatSlice";

interface ChatInputProps {
  chatId?: string;
  receiverId?: string; // only for first-time message
  navigate: (path: string) => void;
}

export default function ChatInput({ chatId, receiverId, navigate }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const socket = getSocket();
  const sendMessage = () => {
    if (!message.trim()) return;

    if (!socket || !socket.connected) return;

    socket.emit(
      "send-message",
      {
        chatId,        // undefined if first-time message
        receiverId,    // required if first-time message
        content: message,
      },
      (res: any) => {
        if (res?.error) {
          console.error("Send message failed:", res.error);
          return;
        }

        // First-time message: navigate to newly created chat
        if (!chatId && res?.chatId) {
          navigate(`/chat/${res.chatId}`);
        }
      }
    );

    setMessage("");
  };

const handleSendMedia = async (file: File) => {
  try {
    const media = await dispatch(uploadChatMedia(file)).unwrap(); // { url, type }
console.log("med",media)
   let content =null
    if (media?.type === "image") content = "send a image"
        else if (media?.type === "video") content = "send a video";
    else if (media?.type==="audio") content = "audio";
    socket.emit(
      "send-message",
      {
        chatId,       // undefined if first-time chat
        receiverId,   // required if first-time
        content,  // optional if no text
        media:media,        // must be { url, type }
      },
      (res: any) => {
        if (res?.error) console.error("Send message failed:", res.error);
      }
    );
  } catch (err) {
    console.error("Upload failed:", err);
  }
};


   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setSelectedFiles(files);
    e.target.value = ""; // reset input
  };

  return (
     <div className="border-t p-3">
  <div className="flex items-center gap-2 rounded-full border px-3 py-2">
    
    {/* Image button (left inside input) */}
    <button
      onClick={() => fileInputRef.current?.click()}
      className="text-gray-500 hover:text-black"
    >
      <Image size={20} />
    </button>

    {/* Text input */}
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Message..."
      className="flex-1 bg-transparent outline-none text-sm"
    />

    {/* Send button (right inside input) */}
    <button
      onClick={sendMessage}
      disabled={!message.trim()}
      className={`${
        message.trim()
          ? "text-blue-500 hover:text-blue-600"
          : "text-gray-400"
      }`}
    >
      <SendHorizontal size={20} />
    </button>
  </div>

  {/* Hidden file input */}
  <input
    ref={fileInputRef}
    type="file"
    hidden
    onChange={(e) =>
      e.target.files && handleSendMedia(e.target.files[0])
    }
  />
</div>

  );
}
