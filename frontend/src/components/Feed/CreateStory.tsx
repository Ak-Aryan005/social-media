import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStory } from '@/redux/slices/storiesSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function CreateStory() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.stories
  );

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const type = selectedFile.type.startsWith('video') ? 'video' : 'image';

    setFile(selectedFile);
    setFileType(type);
    setPreview(URL.createObjectURL(selectedFile));
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const result = await dispatch(
      createStory({ media: file, caption })
    );

    if (createStory.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm bg-card rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Create Story
        </h2>

        {/* Preview */}
        {preview ? (
          <div
            className="relative w-full h-72 rounded-lg mb-3 overflow-hidden cursor-pointer"
            onClick={fileType === 'video' ? togglePlay : undefined}
          >
            {fileType === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  src={preview}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
              </>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <label className="flex items-center justify-center h-72 border-2 border-dashed rounded-lg mb-3 cursor-pointer">
            <span className="text-muted-foreground text-sm">
              Upload image or video
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="w-full resize-none rounded-lg border p-2 text-sm mb-3"
          maxLength={200}
        />

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive mb-2 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Post Story'}
        </button>
      </div>
    </div>
  );
}
