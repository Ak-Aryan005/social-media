import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/redux/store";
import { useAppSelector } from "@/hooks/redux";
import Navbar from "./components/common/Navbar";
import MobileFooter from "./components/Feed/MobileFooter";
// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Search from "./pages/Search";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import ConfirmationCode from "./pages/verify";
import EditPost from "./pages/EditPost";
import AuthInitializer from "./components/Profile/AuthInitializer";
import PostPage from "./pages/PostPage";
import FollowsPage from "./pages/FollowList";
import Chat from "./pages/Chat";
const queryClient = new QueryClient();
import { useEffect } from "react";
import { initSocket } from "@/socket/socket";
import CreateStory from "./components/Feed/CreateStory";
import ChatList from "./pages/ChatList";
// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
import { fetchUnreadCount } from "@/redux/slices/notificationSlice";
import { useAppDispatch } from "@/hooks/redux";
import StoryViewer from "./pages/StoryViewer";
import BlueTickFlow from "./components/subscription/ChoosePlan";
import SubscriptionSuccess from "./components/subscription/SubscriptionSuccess";
import SubscriptionCancel from "./components/subscription/SubscriptionCancel";
import Forgotpassword from "./pages/Fpassword";
import CreateGroup from "./pages/CreateGroup";
import GroupChats from "./components/Chat/GroupChats";
import GroupDetails from "./pages/GroupDetails";
import AddMembers from "./components/Chat/Addmembrs";
function AppContent() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🚀 Initializing socket");
    const socket = initSocket();
    dispatch(fetchUnreadCount());
  }, [isAuthenticated, user?._id]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <main className="pb-14 md:pb-0">
              <Routes>
                {/* Auth Routes */}
                {!isAuthenticated && (
                  <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<Forgotpassword/>} />
                    <Route path="/verify" element={<ConfirmationCode />} />
                  </>
                )}

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Feed />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stories/create"
                  element={
                    <ProtectedRoute>
                      <CreateStory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <BlueTickFlow />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription-success/"
                  element={
                    <ProtectedRoute>
                      <SubscriptionSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription-cancel"
                  element={
                    <ProtectedRoute>
                      <SubscriptionCancel />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stories/:id"
                  element={
                    <ProtectedRoute>
                      <StoryViewer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:postId/edit"
                  element={
                    <ProtectedRoute>
                      <EditPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <Search />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <ProtectedRoute>
                      <Placeholder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Placeholder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  // path={`/chat/:${user?._id || user?.id}`}
                  // path="/chat/:otherUserId"
                  path="/chat/:chatId"
                  element={
                    <ProtectedRoute>
                      <Chat />
                      {/* <ChatWrapper /> */}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/user/:userId"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chatlist/"
                  element={
                    <ProtectedRoute>
                      {/* <Chat  /> */}
                      <ChatList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-group"
                  element={
                    <ProtectedRoute>
                      <CreateGroup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/group/:chatId"
                  element={
                    <ProtectedRoute>
                      <GroupDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/group/:chatId/add-members"
                  element={
                    <ProtectedRoute>
                      <AddMembers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/group-chats'
                  element={
                    <ProtectedRoute>
                      <GroupChats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post/:postId"
                  element={
                    <ProtectedRoute>
                      <PostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId/followers"
                  element={
                    <ProtectedRoute>
                      <FollowsPage type="followers" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId/following"
                  element={
                    <ProtectedRoute>
                      <FollowsPage type="following" />
                    </ProtectedRoute>
                  }
                />
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {/* {isAuthenticated && <MobileFooter />} */}
            <MobileFooter />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <AppContent />
    </Provider>
  );
}

export default App;
