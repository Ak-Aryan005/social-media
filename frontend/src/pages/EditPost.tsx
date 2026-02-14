import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getPostById, updatePost } from '@/redux/slices/postsSlice';
import Navbar from '@/components/common/Navbar';
import CreatePost from './CreatePost';
import { toast } from 'sonner';

export default function EditPost() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedPost, isLoading } = useAppSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [postId, dispatch]);

  if (isLoading && !selectedPost) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!selectedPost) {
    return <p className="text-center mt-10">Post not found</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <CreatePost
        mode="edit"
        post={selectedPost}
        onSubmit={async (data) => {
          try {
            await dispatch(
              updatePost({
                postId: selectedPost._id || selectedPost.id,
                ...data,
              })
            ).unwrap();

            toast.success('Post updated successfully');
            navigate(-1);
          } catch {
            toast.error('Failed to update post');
          }
        }}
      />
    </div>
  );
}
