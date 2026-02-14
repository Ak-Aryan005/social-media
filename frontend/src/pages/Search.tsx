
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import SearchBar from '@/components/common/SearchBar';
import Avatar from '@/components/common/Avatar';
import Loader from '@/components/common/Loader';
import { Skeleton } from '@/components/common/SkeletonLoader';
import { useAppSelector } from '@/hooks/redux';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Image } from 'lucide-react';
import { Navigate } from 'react-router-dom';
// Mock search results
const MOCK_RESULTS = [
  {
    id: '1',
    type: 'user',
    username: 'sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    type: 'user',
    username: 'alex_m',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    type: 'post',
    caption: 'Beautiful sunset at the beach',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    type: 'post',
    caption: 'Coffee and code',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    type: 'user',
    username: 'emma_r',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
];

export default function Search() {
  const { results, isLoading, query } = useAppSelector((state) => state.search);
  const displayResults = query ? results : [];
  const showMockResults = query && displayResults.length === 0;
  const navigate = useNavigate()
// console.log(`dis ${JSON.stringify(displayResults)}`)
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-8"
        >
          Search
        </motion.h1>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
          <p className="text-sm text-muted-foreground mt-2">
            Search for users and posts with a 300ms debounce
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={64} height={64} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !query && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Try searching for users or posts
            </p>
          </div>
        )}

        {!isLoading && query && displayResults.length === 0 && !showMockResults && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No results found for "{query}"
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(showMockResults ? MOCK_RESULTS : displayResults).map((result: any, index: number) => (
            <motion.div
              key={result.id || index || result._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.08,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              {result.type === 'user' ? (
                <Link
                  to={`/profile/${result._id}`}
                  className="flex items-center gap-4"
                >
                  <Avatar src={result.avatar} alt={result.username} size="lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {result.username}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users size={16} />
                      <span>User Profile</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4" onClick={()=>navigate(`/profile/${result._id}`)}>
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={result.avatar}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground line-clamp-2">
                      {result.username}
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {result.fullName}
                    </p>
                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Image size={16} />
                      <span>Post</span>
                    </div> */}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
