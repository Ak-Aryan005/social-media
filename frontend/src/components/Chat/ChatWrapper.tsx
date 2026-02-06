import { useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import Chat from "../../pages/Chat";

export default function ChatWrapper() {
  const { otherUserId } = useParams();
const userId = useAppSelector((s) => s?.auth?.user?._id|| s?.auth?.user?.id);
// const otherUserId = userId

console.log("md",userId)
console.log("dd",otherUserId)
  if (!otherUserId || !userId) return null;

  return <Chat userId={userId} otherUserId={otherUserId} />;
}
