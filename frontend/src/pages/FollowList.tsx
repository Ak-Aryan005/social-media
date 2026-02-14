import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Loader from "@/components/common/Loader";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  getAnothersFollowers,
  getAnothersFollowing,
  // follow,
  // unfollow,
} from "@/redux/slices/followsSlice";
import { followUser, unfollowUser } from "@/redux/slices/userSlice";
/**
 * Backend response shape:
 * {
 *  _id: string;
 *  userId: string;
 *  username: string;
 *  fullName: string;
 *  avatar?: string;
 *  isFollowing: boolean;
 * }
 */

interface FollowUser {
  _id: string;
  userId: string;
  username: string;
  fullName: string;
  avatar?: string;
  isFollowing: boolean;
  isVerified: boolean;
}

interface Props {
  type: "followers" | "following";
}

export default function FollowsPage({ type }: Props) {
  const { userId } = useParams<{ userId: string }>();
  const avatarimg = "/DP For Girls (19).jpg";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { followers, following, isLoading, error } = useAppSelector(
    (state) => state.follows,
  );
  useEffect(() => {
    if (!userId) return;

    if (type === "followers") {
      dispatch(getAnothersFollowers(userId));
    } else {
      dispatch(getAnothersFollowing(userId));
    }
  }, [type, userId, dispatch]);

  const list = (type === "followers" ? followers : following) as FollowUser[];
  // console.log(`usr ${userId}`)
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden"
        >
          {/* Header */}

          {/* Header / Tabs */}
          <div className="border-b border-border/50">
            <div className="flex">
              <button
                onClick={() => navigate(`/profile/${userId}/followers`)}
                className={`flex-1 py-3 text-sm font-semibold transition
        ${
          type === "followers"
            ? "border-b-2 border-primary text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
              >
                Followers
              </button>

              <button
                onClick={() => navigate(`/profile/${userId}/following`)}
                className={`flex-1 py-3 text-sm font-semibold transition
        ${
          type === "following"
            ? "border-b-2 border-primary text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
              >
                Following
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {type}
            </h2>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="py-12 flex justify-center">
              <Loader size="md" variant="instagram" />
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="py-10 text-center text-destructive">{error}</div>
          )}

          {/* Empty */}
          {!isLoading && !error && list.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              No {type} yet
            </div>
          )}

          {/* List */}
          {!isLoading &&
            !error &&
            list.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border-t border-border/50"
              >
                {/* User info */}
                <div
                  className="flex items-center gap-3 min-w-0"
                  onClick={() => navigate(`/profile/${user.userId}`)}
                >
                  <img
                    src={user.avatar || avatarimg}
                    alt={user.username}
                    className="w-11 h-11 rounded-full object-cover border border-border"
                  />
                  <div className="min-w-0 cursor-pointer">
                    <span className="flex gap-0">
                      <p className="font-medium text-foreground truncate">
                        {user.username}
                      </p>
                      {user.isVerified && (
                        <span className="font-semibold text-foreground text-sm sm:text-base pt-1">
                          <MdVerified className="text-[#0093f5]" size={17} />
                        </span>
                      )}
                    </span>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.fullName}
                    </p>
                  </div>
                </div>

                {/* Follow button */}
                <button
                  onClick={
                    () =>
                      user.isFollowing
                        ? dispatch(unfollowUser(user.userId))
                        : dispatch(followUser(user.userId))
                    // ? dispatch(unfollow(user.userId))
                    // : dispatch(follow(user.userId))
                  }
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition
                    ${
                      user.isFollowing
                        ? "bg-muted text-foreground hover:bg-muted/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </button>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
