// import { useEffect ,useLayoutEffect,useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/hooks/redux';
// import { fetchUserPosts } from '@/redux/slices/postsSlice';
// import PostCard from '@/components/Feed/PostCard';
// import { Loader2 } from 'lucide-react';


// export default function UserPostsPage() {
//   const { userId } = useParams<{ userId: string }>();
//   const { postId } = useParams<{ postId: string }>();
//   const dispatch = useAppDispatch();
// console.log(`userid ${postId}`)
//   const { userPosts, isLoading } = useAppSelector(
//     (state) => state.posts
//   );


//   // useEffect(() => {
//   //   if (userId) {
//   //     dispatch(fetchUserPosts(userId));
//   //   }
//   // }, [userId,dispatch]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
//       </div>
//     );
//   }

//   if (!userPosts.length) {
//     return (
//       <p className="text-center text-muted-foreground">
//         No posts yet
//       </p>
//     );
//   }
//     const containerRef = useRef<HTMLDivElement>(null);
// const POST_HEIGHT = 620;
//    useLayoutEffect(() => {
//     if (!postId || !containerRef.current || !userPosts.length) return;

//     const index = userPosts.findIndex(
//       (p) => (p.id || p._id) === postId
//     );

//     if (index === -1) return;

//     containerRef.current.scrollTop = index * POST_HEIGHT;
//   }, [postId, userPosts]);

//   return (
//         <div className="min-h-screen bg-background">
//     <div className="max-w-xl mx-auto px-4 py-6 space-y-6  overflow-x-auto scrollbar-hide" >
//       {userPosts.map((post) => (
//         <PostCard
//           key={post.id || post._id}
//           id={post.id || post._id}
//           userId={post.userId}
//           username={post.username}
//           avatar={post.avatar}
//           image={ Array.isArray(post.image)
//         ? post.image
//         : post.image
//         ? [post.image]
//         : []}
//           caption={post.caption}
//           likes={post.likes}
//           comments={post.comments}
//           isLiked={post.isLiked}
//           createdAt={post.createdAt}
//           location={post.location}
//         />
//       ))}
//     </div>
//     </div>
//   );
// }















// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "@/hooks/redux";
// import { fetchUserPosts } from "@/redux/slices/postsSlice";
// import PostCard from "@/components/Feed/PostCard";
// import { Loader2 } from "lucide-react";

// export default function UserPostsPage() {
//   const { userId, postId } = useParams<{
//     userId: string;
//     postId: string;
//   }>();

//   const dispatch = useAppDispatch();
//   const { userPosts, isLoading } = useAppSelector(
//     (state) => state.posts
//   );

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchUserPosts(userId));
//     }
//   }, [userId, dispatch]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
//       </div>
//     );
//   }

//   if (!userPosts.length) {
//     return (
//       <p className="text-center text-muted-foreground">
//         No posts yet
//       </p>
//     );
//   }

//   // ✅ FIND ONLY THE CLICKED POST
//   const post = userPosts.find(
//     (p) => (p.id || p._id) === postId
//   );

//   if (!post) {
//     return (
//       <p className="text-center text-muted-foreground">
//         Post not found
//       </p>
//     );
//   }

//   return (
//     <div className=" bg-background">
//       <div className="max-w-xl mx-auto px-4 py-6">
//         <PostCard
//           id={post.id || post._id}
//           userId={post.userId}
//           username={post.username}
//           avatar={post.avatar}
//           image={
//             Array.isArray(post.image)
//               ? post.image
//               : post.image
//               ? [post.image]
//               : []
//           }
//           caption={post.caption}
//           likes={post.likes}
//           comments={post.comments}
//           isLiked={post.isLiked}
//           createdAt={post.createdAt}
//           location={post.location}
//         />
//       </div>
//     </div>
//   );
// }





















import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchUserPosts } from "@/redux/slices/postsSlice";
import PostCard from "@/components/Feed/PostCard";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserPostsPage() {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userPosts, isLoading } = useAppSelector((state) => state.posts);

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch all user posts
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts(userId));
    }
  }, [userId, dispatch]);

  // ✅ Ensure postId exists in Redux
  const post = userPosts.find((p) => (p.id || p._id) === postId);

  if (isLoading || !post) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  // Find current index
  const currentIndex = userPosts.findIndex((p) => (p.id || p._id) === postId);

  const goPrevious = () => {
    if (currentIndex > 0) {
      const prevPostId = userPosts[currentIndex - 1].id || userPosts[currentIndex - 1]._id;
      navigate(`/post/${prevPostId}`);
    }
  };

  const goNext = () => {
    if (currentIndex < userPosts.length - 1) {
      const nextPostId = userPosts[currentIndex + 1].id || userPosts[currentIndex + 1]._id;
      navigate(`/post/${nextPostId}`);
    }
  };

  return (
    <div className="bg-background flex items-center justify-center relative">
      {/* PostCard */}
      <div className="w-full max-w-xl px-4 py-6">
        {/* Pass current postId directly so PostCard uses fresh data */}
        <PostCard
          key={post.id || post._id}
          id={post.id || post._id}
          userId={post.userId}
          username={post.username}
          avatar={post.avatar}
          image={Array.isArray(post.image) ? post.image : post.image ? [post.image] : []}
          caption={post.caption}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.isLiked}
          createdAt={post.createdAt}
          location={post.location}
          isVerified={post.isVerified}
        />
      </div>

      {/* Previous Button */}
      {!isMobile && currentIndex > 0 && (
        <button
          onClick={goPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next Button */}
      {!isMobile && currentIndex < userPosts.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
