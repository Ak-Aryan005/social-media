import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3x3, User } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import { ProfileSkeleton } from '@/components/common/SkeletonLoader';
import InputField from '@/components/common/InputField';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProfile, updateProfile,addProfilePicture,fetchCurrentUserProfile } from '@/redux/slices/userSlice';
import { fetchUserPosts } from '@/redux/slices/postsSlice';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { Formik, Form } from 'formik';
import { profileSchema } from '@/utils/validationSchemas';
import { toast } from 'sonner';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.user);
  const { userPosts, isLoading: postsLoading } = useAppSelector(
    (state) => state.posts 
  );
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);


  // If visiting /profile/:userId -> load that user's profile
useEffect(() => {
  if (userId) {
    dispatch(fetchProfile(userId)); 
    dispatch(fetchUserPosts(userId));
  }
}, [userId, dispatch]);



  const isOwnProfile =(currentUser?._id || currentUser?.id) === (profile?._id || profile?.id);

  const displayProfile = profile;
  const displayPosts = userPosts;
  const handleEditProfile = async (values: {
    username: string;
    fullName: string;
    bio: string;
  }) => {
    try {
      // 1. Update username / bio
await dispatch(updateProfile({
  username: values.username,
  fullName:values.fullName,
  bio: values.bio,
})).unwrap();

// 2. Upload avatar if selected
if (selectedImageFile) {
  await dispatch(addProfilePicture(selectedImageFile)).unwrap();
}
      toast.success('Profile updated successfully');
      setEditModalOpen(false);
      setSelectedImageFile(null);
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Navbar /> */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Navbar /> */}
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <ProfileHeader
        userId={displayProfile.id || displayProfile._id}
        username={displayProfile.username}
        fullName={displayProfile.fullName}
        avatar={displayProfile.avatar}
        followers={displayProfile.followers || 0}
        following={displayProfile.following || 0}
        posts={displayProfile.posts || displayPosts.length}
        bio={displayProfile.bio || ''}
        isFollowing={displayProfile.isFollowing || false}
        isVerififed={displayProfile.isVerified || false}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setEditModalOpen(true)}  
      />

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {postsLoading && displayPosts.length === 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : displayPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Grid3x3 className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isOwnProfile ? 'No posts yet' : 'No posts'}
            </h3>
            <p className="text-muted-foreground">
              {isOwnProfile
                ? 'Share your first photo or video!'
                : 'This user has not posted anything yet.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
            {displayPosts?.map((post: any, index: number) => (
              <motion.div
                key={post.id || post._id || index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group relative"
              >
                <Link to={`/post/${post.id || post._id}`}>
                  <img
                    src={post?.image[0] || [] || post?.media?.[0] || post?.media || post?.post[0]}
                    alt="Post"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-4 text-white"
                    >
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="font-semibold">
                          {post.likes || post.likesCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                        </svg>
                        <span className="font-semibold">
                          {post.comments || post.comments?.length || 0}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        title="Edit Profile"
        onClose={() => {
          setEditModalOpen(false);
          setSelectedImageFile(null);
        }}
        size="md"
      >
        <Formik
          initialValues={{
            username: displayProfile.username || '',
            fullName:displayProfile.fullName || '',
            bio: displayProfile.bio || '',
          }}
          validationSchema={profileSchema}
          onSubmit={handleEditProfile}
        >
          <Form className="space-y-5">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      selectedImageFile
                        ? URL.createObjectURL(selectedImageFile)
                        : displayProfile.avatar
                    }
                    alt={displayProfile.username}
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-border"
                  />
                  {selectedImageFile && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) {
                        setSelectedImageFile(file);
                      }
                    }}
                    className="w-full px-3 py-2 bg-muted text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>
            </div>

            <InputField
              name="username"
              label="Username"
              placeholder="Your username"
              required
            />
            <InputField
              name="fullName"
              label="fullName"
              placeholder="Your fullname"
              required
            />
            <InputField
              name="bio"
              label="Bio"
              placeholder="Tell your story..."
            />

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" className="w-full py-6" size="lg">
                Save Changes
              </Button>
            </motion.div>
          </Form>
        </Formik> 
      </Modal>
    </div>
  );
}
