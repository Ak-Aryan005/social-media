import { Link, NavLink,useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/redux/slices/authSlice';
import { fetchUnreadCount } from '@/redux/slices/notificationSlice';
import { useEffect } from 'react';
import {
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  LogOut,
  User,
  Moon,
  Sun,
  Search,
  MessageCirclePlus
} from 'lucide-react';
import InstagramLogo from './InstagramLogo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const avatarimg = "/DP For Girls (19).jpg";
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
 const unreadCount = useAppSelector(
    (state: any) => state.notifications.unreadCount
  );
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Even if logout fails, clear local state
    }
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <InstagramLogo size={28} />
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Instagram
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-8">
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <NavLink
                to="/"
                className={`text-foreground hover:text-primary transition-colors duration-200 relative group`}
                aria-label="Home"
              >
                <Home size={26} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </NavLink>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/search"
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
                aria-label="Search"
              >
                <Search size={26} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, y: -2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/create"
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
                aria-label="Create Post"
              >
                <PlusSquare size={26} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
             <Link
      to="/notifications"
      className="text-foreground hover:text-primary transition-colors duration-200 relative group"
      aria-label="Notifications"
    >
      <Heart size={26} />

      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
      )}

      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
    </Link>
            </motion.div>
            {/* <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/notifications"
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
                aria-label="Notifications"
              >
                <Heart size={26} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div> */}
              <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/chatlist"
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
                aria-label="Notifications"
              >
                <MessageCirclePlus size={26} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* <Link
                to={`/profile/${user?.id || user?._id}`}
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
                aria-label="Profile"
              >
                <User size={26} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link> */}
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
            </motion.div>
            
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
 <Link  to="/chatlist"   className="md:hidden">
                  <MessageCirclePlus className="h-5 w-5" />
                </Link>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/search" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/create" className="flex items-center gap-2">
                    <PlusSquare className="w-4 h-4" />
                    Create Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/profile/${user?.id || user?._id}`}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
