import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchUsersForGroup,
  fetchGroupDetails,
  addMembersThunk,
} from "@/redux/slices/chatSlice";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
import { MdVerified } from "react-icons/md";

export default function AddMembers() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultUser = "/DP For Girls (19).jpg";

  const { groupUsers, selectedGroup, isLoading } =
    useAppSelector((state) => state.chat);

  const { user } = useAppSelector((state) => state.auth);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const loadData = async () => {
      if (!chatId) return;

      try {
        await Promise.all([
          dispatch(fetchUsersForGroup()).unwrap(),
          dispatch(fetchGroupDetails(chatId)).unwrap(),
        ]);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setIsPageLoading(false);
      }
    };

    loadData();
  }, [chatId, dispatch]);

  /* ================= FILTER USERS ================= */

  const availableUsers = useMemo(() => {
    if (!groupUsers?.length) return [];

    const existingIds = new Set(
      selectedGroup?.participants?.map((p) => p._id)
    );

    return groupUsers.filter(
      (u) =>
        u._id !== user?._id &&
        !existingIds.has(u._id)
    );
  }, [groupUsers, selectedGroup, user]);

  /* ================= HANDLE SELECT ================= */

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* ================= HANDLE ADD ================= */

  const handleAddMembers = async () => {
    if (!chatId || selectedUsers.length === 0) {
      toast.error("Select at least one user");
      return;
    }

    try {
      await dispatch(
        addMembersThunk({
          chatId,
          participantIds: selectedUsers,
        })
      ).unwrap();

      toast.success("Members added successfully");
      navigate(`/group/${chatId}`);
    } catch (err: any) {
      toast.error(err || "Failed to add members");
    }
  };

  /* ================= RENDER ================= */

  if (isPageLoading || isLoading) return <Loader />;

  if (!selectedGroup)
    return <div className="p-6">Group not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        Add Members to {selectedGroup.groupName}
      </h2>

      {availableUsers.length === 0 ? (
        <p className="text-muted-foreground">
          No available users to add
        </p>
      ) : (
        <div className="space-y-4">
          {availableUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => toggleUser(u._id)}
              className={`flex items-center gap-4 border p-3 rounded-lg cursor-pointer transition
              ${
                selectedUsers.includes(u._id)
                  ? "bg-muted/40"
                  : "hover:bg-muted/30"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(u._id)}
                onChange={() => toggleUser(u._id)}
              />

              <img
                src={u.avatar || defaultUser}
                alt={u.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-medium flex items-center">
                  {u.username}
                  {u.isVerified && (
                    <span className="pl-1">
                      <MdVerified
                        className="text-[#0093f5]"
                        size={17}
                      />
                    </span>
                  )}
                </p>

                <p className="text-sm text-muted-foreground">
                  {u.fullName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleAddMembers}
          disabled={selectedUsers.length === 0}
        >
          Add Selected
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate(`/group/${chatId}`)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
