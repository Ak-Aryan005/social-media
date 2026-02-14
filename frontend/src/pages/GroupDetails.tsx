import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchGroupDetails,
  updateGroupThunk,
  removeMembersThunk,
  makeAdminThunk,
  leaveGroupThunk,
} from "@/redux/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

export default function GroupDetails() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultUser = "/DP For Girls (19).jpg";
  const defaultGroup = "/We Bare Bears Pictures.jpg";

  const { selectedGroup, isLoading } = useAppSelector(
    (state) => state.chat
  );
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  /* ================= FETCH GROUP ================= */
  useEffect(() => {
    if (chatId) {
      dispatch(fetchGroupDetails(chatId));
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    if (selectedGroup) {
      setName(selectedGroup.groupName);
    }
  }, [selectedGroup]);

  if (isLoading && !selectedGroup) return <Loader />;
  if (!selectedGroup) return <div className="p-6">Group not found</div>;

  /* ================= SAFE ADMIN ID ================= */
  const adminId =
    typeof selectedGroup.admin === "string"
      ? selectedGroup.admin
      : selectedGroup.admin;

  const isAdmin = adminId === user?._id;

  /* ================= UPDATE GROUP ================= */
  const handleUpdate = async () => {
    if (!chatId) return;

    try {
      await dispatch(
        updateGroupThunk({
          chatId,
          name,
          media: avatarFile || undefined,
        })
      ).unwrap();

      await dispatch(fetchGroupDetails(chatId)).unwrap();

      toast.success("Group updated");
      setAvatarFile(null);
    } catch (err: any) {
      toast.error(err || "Failed to update group");
    }
  };

  /* ================= REMOVE MEMBER ================= */
  const handleRemove = async (memberId: string) => {
    if (!chatId) return;

    try {
      await dispatch(
        removeMembersThunk({
          chatId,
          userIds: [memberId],
        })
      ).unwrap();

      await dispatch(fetchGroupDetails(chatId)).unwrap();
      toast.success("Member removed");
    } catch (err: any) {
      toast.error(err || "Failed to remove member");
    }
  };

  /* ================= MAKE ADMIN ================= */
  const handleMakeAdmin = async (memberId: string) => {
    if (!chatId) return;

    try {
      await dispatch(
        makeAdminThunk({
          chatId,
          newAdminId: memberId,
        })
      ).unwrap();

      await dispatch(fetchGroupDetails(chatId)).unwrap();
      toast.success("Admin updated");
    } catch (err: any) {
      toast.error(err || "Failed to update admin");
    }
  };

  /* ================= LEAVE GROUP ================= */
  const handleLeave = async () => {
    if (!chatId) return;

    try {
      await dispatch(leaveGroupThunk(chatId)).unwrap();
      toast.success("You left the group");
      navigate("/chatlist");
    } catch (err: any) {
      toast.error(err || "Failed to leave group");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ================= GROUP INFO ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src={
            avatarFile
              ? URL.createObjectURL(avatarFile)
              : selectedGroup.groupAvatar || defaultGroup
          }
          alt="group"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto sm:mx-0"
        />

        {isAdmin && (
          <input
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={(e) =>
              setAvatarFile(e.target.files?.[0] || null)
            }
          />
        )}
      </div>

      {/* ================= ADMIN VIEW ================= */}
      {isAdmin ? (
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleUpdate}
              className="w-full sm:w-auto"
            >
              Update Group
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() =>
                navigate(`/group/${chatId}/add-members`)
              }
            >
              Add Members
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-center sm:text-left">
            {selectedGroup.groupName}
          </h2>

          <Button
            variant="destructive"
            onClick={handleLeave}
            className="w-full sm:w-auto"
          >
            Leave Group
          </Button>
        </div>
      )}

      {/* ================= MEMBERS ================= */}
      <div>
        <h3 className="font-semibold text-lg mb-3">
          Members ({selectedGroup.participants?.length || 0})
        </h3>

        <div className="space-y-3">
          {selectedGroup.participants?.map((member: any) => {
            if (!member || typeof member === "string") return null;

            return (
              <div
                key={member._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 rounded-lg border"
              >
                {/* Member Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar || defaultUser}
                    alt={member.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {member.fullName}
                      {member._id === adminId && (
                        <span className="ml-2 text-xs text-blue-500">
                          (Admin)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{member.username}
                    </p>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && member._id !== adminId && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() =>
                        handleMakeAdmin(member._id)
                      }
                    >
                      Make Admin
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() =>
                        handleRemove(member._id)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
