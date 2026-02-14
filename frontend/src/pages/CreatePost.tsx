import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X, MapPin, Hash } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { uploadPost } from '@/redux/slices/postsSlice';
import { toast } from 'sonner';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  caption: Yup.string().max(2200),
  location: Yup.string(),
  tags: Yup.string(),
});

export default function CreatePost({
  mode = 'create',
  post,
  onSubmit,
}: {
  mode?: 'create' | 'edit';
  post?: any;
  onSubmit?: (data: any) => Promise<void>;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading } = useAppSelector((state) => state.posts);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    mode === 'edit'
      ? Array.isArray(post?.image)
        ? post.image
        : post?.image
        ? [post.image]
        : []
      : []
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then((imgs) => setPreviews((prev) => [...prev, ...imgs]));

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* {mode === 'create' && <Navbar />} */}
      {mode === 'create'}

      {isLoading && <Loader fullScreen text="Saving post..." />}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Formik
          enableReinitialize
          initialValues={{
            caption: post?.caption || '',
            location: post?.location || '',
            tags: post?.tags || '',
          }}
          validationSchema={schema}
          onSubmit={async (values) => {
            if (!previews.length) {
              toast.error('Please select at least one image');
              return;
            }

            const payload = {
              caption: values.caption,
              location: values.location,
              tags: values.tags,
              media: selectedFiles.length ? selectedFiles : undefined,
            };

            if (mode === 'edit' && onSubmit) {
              await onSubmit(payload);
            } else {
              await dispatch(uploadPost(payload)).unwrap();
              toast.success('Post created successfully');
              navigate('/');
            }
          }}
        >
          {({ isValid }) => (
            <Form className="space-y-6">
              <motion.h1 className="text-3xl font-bold">
                {mode === 'edit' ? 'Edit Post' : 'Create Post'}
              </motion.h1>

              {/* Images */}
              {/* <div className="flex flex-wrap gap-4"> */}
              <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6">
                 <div>
                   <label className="block text-sm font-semibold text-foreground mb-3">
                   Photos
                   </label>
                     {previews.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-2 flex-wrap justify-center">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-40 h-40">
                    <img
                      src={src}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  // className="w-40 h-40 border-2 border-dashed rounded-xl flex items-center justify-center"
                  className="w-40 h-40 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground hover:bg-muted"
                  // className="w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 hover:bg-muted/50"
                >
                  <ImagePlus />
                </button>
              </div>
): (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 hover:bg-muted/50"
                    >
                      <ImagePlus size={64} />
                      <p className="font-semibold">Select photos</p>
                    </button>
                  )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
 </div>
              {/* Caption */}
              <div>
                <Field
                  as="textarea"
                  name="caption"
                  rows={4}
                  className="w-full p-3 bg-muted rounded-lg resize-none"
                  placeholder="Write a caption..."
                />
                <ErrorMessage name="caption" component="div" />
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 mb-1">
                  <MapPin size={16} /> Location
                </label>
                <Field
                  name="location"
                  className="w-full p-3 bg-muted rounded-lg"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 mb-1">
                  <Hash size={16} /> Tags
                </label>
                <Field
                  name="tags"
                  className="w-full p-3 bg-muted rounded-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full py-6"
                >
                {mode === 'edit' ? 'Update Post' : 'Share Post'}
              </Button>
                </div>  
            </Form>
          )}
        </Formik>
      </div>
    </div>
    
  );
}




