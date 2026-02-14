// MobileFooter.tsx
import { Link, NavLink } from 'react-router-dom';
// import { Home, Home as HomeFilled } from 'lucide-react'; // use filled if available
// import { Heart, Heart as HeartFilled } from 'lucide-react';
import { FaSearch } from "react-icons/fa";
import { RiHeartLine,RiHeartFill  } from "react-icons/ri";
import { FiHome } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import { BsSearchHeartFill } from "react-icons/bs";
import { BsSearchHeart } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";


import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {  useAppSelector } from '@/hooks/redux';
export default function MobileFooter() {
const avatarimg = "/DP For Girls (19).jpg";

  const { isAuthenticated, user, unreadCount } = useAppSelector((state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  unreadCount: state.notifications?.unreadCount ?? 0,
}));

  if (!isAuthenticated) return null;
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border md:hidden"
    >
      <div className="flex items-center justify-around h-14">
<NavLink to="/" aria-label="Home">
  {({ isActive }) => (
    isActive? <GoHomeFill className={`h-6 w-6 transition-colors duration-200`} />
    :<FiHome className={`h-6 w-6 transition-colors duration-200`}/>
  )}
</NavLink>

<NavLink to="/search" aria-label="Search">
  {({ isActive }) => (
     isActive? <BsSearchHeart className={` h-6 w-6  transition-colors duration-200`} />
     : <BsSearch className="h-6 w-6" />
  )}
</NavLink>

<NavLink to="/create" aria-label="Create">
  {({ isActive }) => (
    <PlusSquare
      className={`h-7 w-7 transition-colors duration-200 ${
        isActive ? 'text-primary' : 'text-foreground'
      }`}
    />
  )}
</NavLink>

<NavLink to="/notifications" aria-label="Notifications" className="relative group">
  {({ isActive }) => (
    <>
      {/* Icon */}
      {!isActive ? (
        <RiHeartLine className="h-7 w-7 transition-colors duration-200" />
      ) : (
        <RiHeartFill className="h-7 w-7 transition-colors duration-200" />
      )}

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
      )}

      {/* Bottom hover bar */}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
    </>
  )}
</NavLink>
        <NavLink
  to={`/profile/${user?.id || user?._id}`}
  aria-label="Profile"
  className={({ isActive }) =>
    `relative flex items-center justify-center ${
      isActive ? 'ring-1 ring-primary ring-offset-1 rounded-full' : ''
    }`
  }
>
  <img
    src={user?.avatar || user?.avatar || avatarimg}
    alt="Profile"
    className="h-7 w-7 rounded-full object-cover"
  />
</NavLink>

      </div>
    </motion.footer>
  );
}

