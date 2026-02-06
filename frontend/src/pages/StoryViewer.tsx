import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStories, viewStory } from '@/redux/slices/storiesSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { X, Volume2, VolumeX,Trash } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
const IMAGE_DURATION = 5000; // 5 seconds per image

export default function StoryViewer() {
  const { id } = useParams(); // userId
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userStories, isLoading } = useSelector(
    (state: RootState) => state.stories
  );
    const { isAuthenticated,user } = useAppSelector((state) => state.auth);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Current story
  const currentStory = userStories[currentIndex] || null;
console.log(`cu ${JSON.stringify(currentStory)}`)
console.log(`c${currentIndex}`)
  /* ---------------- Fetch user stories ---------------- */
  useEffect(() => {
    if (id) dispatch(fetchUserStories(id));
  }, [id, dispatch]);

  /* ---------------- Reset progress when stories change ---------------- */
useEffect(() => {
  if (userStories.length > 0) {
    setCurrentIndex(0);
    setProgress(0);
    setPaused(false);
  }
}, [id]); // reset ONLY when user changes


  /* ---------------- Hit viewStory API when story changes ---------------- */
 const viewedStoryRef = useRef<string | null>(null);

useEffect(() => {
  if (!currentStory) return;

  if (viewedStoryRef.current === currentStory._id) return;

  viewedStoryRef.current = currentStory._id;
  dispatch(viewStory(currentStory._id));
}, [currentIndex]); // 👈 depend on index, not object


  /* ---------------- Image auto-progress ---------------- */
  useEffect(() => {
    if (!currentStory || currentStory.media.type !== 'image') return;

    let start = Date.now() - (progress / 100) * IMAGE_DURATION;

    const tick = () => {
      if (!paused) {
        const elapsed = Date.now() - start;
        const value = Math.min((elapsed / IMAGE_DURATION) * 100, 100);
        setProgress(value);

        if (value >= 100) {
          nextStory();
          return;
        }
      }
      timerRef.current = setTimeout(tick, 50);
    };

    tick();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, paused, currentStory]);

  /* ---------------- Video progress ---------------- */
  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  /* ---------------- Navigate stories ---------------- */
  const nextStory = () => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      navigate(-1); // exit viewer
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else {
      navigate(-1); // exit viewer
    }
  };

  /* ---------------- Hold to pause ---------------- */
  const handleHoldStart = () => {
    setPaused(true);
    videoRef.current?.pause();
  };

  const handleHoldEnd = () => {
    setPaused(false);
    if (currentStory?.media.type === 'video') videoRef.current?.play();
  };

  /* ---------------- Swipe support ---------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    handleHoldStart();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleHoldEnd();
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    const threshold = 50;

    if (diff > threshold) prevStory();
    else if (diff < -threshold) nextStory();

    setTouchStartX(null);
  };

  /* ---------------- Render ---------------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading…
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        No stories available
      </div>
    );
  }

  const { media, caption } = currentStory;

  return (
    <div
      className="fixed inset-0 top-[64px] bg-background flex items-center justify-center backdrop-blur-sm z-50"
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full w-full  sm:max-w-[420px] bg-[#020817] md:rounded-xl overflow-hidden shadow-lg">
        {/* Progress bars */}
        <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
          {userStories.map((_, i) => (
            <div key={i} className="h-1 bg-white/20 flex-1 rounded">
              <div
                className="h-full bg-white rounded transition-all"
                style={{
                  width:
                    i < currentIndex
                      ? '100%'
                      : i === currentIndex
                      ? `${Math.max(progress, 2)}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top-right controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <button onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
          </button>
          { currentStory.user._id===user._id &&
            <button onClick={() => navigate(-1)}>
            <Trash className="text-white" /> 
          </button>}
          <button onClick={() => navigate(-1)}>
            <X className="text-white" />
          </button>
        </div>

        {/* Media */}
        {media.type === 'image' && (
          <img
            src={media.url}
            alt="story"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}

        {media.type === 'video' && (
          <video
            ref={videoRef}
            src={media.url}
            autoPlay
            muted={muted}
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={nextStory}
          />
        )}

        {/* Caption */}
        {caption && (
          <div className="absolute bottom-6 left-0 right-0 px-4 z-20">
            <p className="text-white text-center text-sm bg-black/50 rounded-lg p-2">{caption}</p>
          </div>
        )}

        {/* Left/right clickable zones for desktop */}
        <div className="absolute inset-0 flex justify-between z-10">
          <div className="flex-1" onClick={prevStory} />
          <div className="flex-1" onClick={nextStory} />
        </div>
      </div>
    </div>
  );
}
