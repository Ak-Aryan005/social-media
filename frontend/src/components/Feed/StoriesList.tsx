import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoryItem from './StoryItem';
import { fetchStories } from '@/redux/slices/storiesSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

export default function StoriesList() {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, isLoading } = useSelector(
    (state: RootState) => state.stories
  );
  const { isAuthenticated,user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  /** 🔁 Group stories by user._id */
  const groupedStories = useMemo(() => {
    const map = new Map<string, typeof stories>();

    stories.forEach((story) => {
      const userId = story.user._id; // ✅ now user is an object
      if (!map.has(userId)) map.set(userId, []);
      map.get(userId)!.push(story);
    });

    return Array.from(map.entries()); // [userId, Story[]]
  }, [stories]);

  if (isLoading) return null;

  return (
    <div className="flex gap-4 overflow-x-auto py-2">
      {/* Create story */}
      <Link to="/stories/create">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed flex items-center justify-center">
          <Plus className="w-6 h-6 text-muted-foreground" />
        </div>
      </Link>

      {/* One story item per user */}
      {groupedStories.map(([userId, userStories]) => {
        const firstStory = userStories[0];

        // Check if all stories are viewed by current user
        const allViewed = userStories.every((s) =>
          s.views.includes('ME') // replace 'ME' with logged-in user ID
        );

        return (
          <StoryItem
            key={userId}
            id={userId} // ✅ this will be passed to StoryViewer
            username={firstStory.user.username || 'User'}
            avatar={firstStory.user.avatar || "/DP For Girls (19).jpg" }
            currentUserId={user?._id} // pass your logged-in user ID here
            views={firstStory.views}
          />
        );
      })}
    </div>
  );
}
