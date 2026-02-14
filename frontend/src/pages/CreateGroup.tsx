import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchUsersForGroup, createGroupThunk } from "@/redux/slices/chatSlice";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateGroup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { groupUsers, isLoading, isCreatingGroup } = useAppSelector(
    (state) => state.chat
  );

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    dispatch(fetchUsersForGroup());
  }, [dispatch]);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2) {
      toast.error("Select at least 2 users");
      return;
    }

    try {
      const result = await dispatch(
        createGroupThunk({
          participantIds: selectedUsers,
          groupName,
        })
      ).unwrap();

      toast.success("Group created successfully");
      navigate(`/chat/${result._id}`);
    } catch (error: any) {
      toast.error(error || "Failed to create group");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Create Group
          </h1>
          <p className="text-muted-foreground">
            Select people to add
          </p>
        </motion.div>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-3 mb-6 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader size="lg" variant="instagram" text="Loading users..." />
          </div>
        )}

        {/* Users List */}
        {!isLoading && (
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            {groupUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
                onClick={() => toggleUser(user._id)}
                className={`flex items-center gap-4 px-4 py-4 cursor-pointer border-b last:border-b-0 transition
                ${selectedUsers.includes(user._id) ? "bg-muted/40" : "hover:bg-muted/30"}`}
              >
                <img
                  src={user.avatar || "/DP For Girls (19).jpg"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {user.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user.fullName}
                  </p>
                </div>

                {selectedUsers.includes(user._id) && (
                  <div className="w-5 h-5 rounded-full bg-primary" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <Button
            onClick={handleCreateGroup}
            disabled={isCreatingGroup}
            className="w-full py-6"
            size="lg"
          >
            {isCreatingGroup ? "Creating..." : "Create Group"}
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
