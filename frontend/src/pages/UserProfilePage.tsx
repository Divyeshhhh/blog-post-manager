import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../types/Auth";
import type { BlogPost } from "../types/BlogPost";
import { authApi } from "../services/api";
import { blogPostApi } from "../services/api";
import { BlogPostCard } from "../components/BlogPostCard";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile =
    currentUser?.id === Number(userId) || (!userId && currentUser);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
      return;
    }

    if (currentUser) {
      fetchUserData(String(currentUser.id));
      return;
    }

    setLoading(false);
    navigate("/login");
  }, [userId, currentUser, navigate]);

  const fetchUserData = async (idParam?: string) => {
    const idToUse = idParam ?? userId;
    if (!idToUse) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [userData, userPosts] = await Promise.all([
        authApi.getUserById(parseInt(idToUse)),
        blogPostApi.getUserPosts(parseInt(idToUse)),
      ]);
      setUser(userData);
      setPosts(userPosts);
    } catch (err) {
      console.error(err);
      showToast("Failed to load user profile.", "error");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await blogPostApi.delete(id);
      setPosts(posts.filter((post) => post.id !== id));
      showToast("Post deleted successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete post.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-700 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-xl text-gray-600 font-semibold mb-4">
            User not found
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Feed
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          {/* Cover Background */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative z-0">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Content */}
          <div className="px-6 md:px-10 pb-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative -mt-16 md:-mt-20">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-2xl border-4 border-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {isOwnProfile && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 mt-4 md:mt-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      {user.username}
                      {isOwnProfile && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          You
                        </span>
                      )}
                    </h1>
                    {user.fullName && (
                      <p className="text-xl text-gray-600 mb-2 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {user.fullName}
                      </p>
                    )}
                    <p className="text-gray-500 flex items-center gap-2 mb-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {user.email}
                    </p>
                    {user.bio && (
                      <p className="text-gray-700 max-w-2xl leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200 break-words [overflow-wrap:anywhere]">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {isOwnProfile && (
                    <button
                      onClick={() => navigate("/profile/edit")}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {posts.length}
                </p>
                <p className="text-gray-600 text-sm mt-1">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-600 text-sm mt-1">Joined</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  {Math.floor(
                    (Date.now() - new Date(user.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                </p>
                <p className="text-gray-600 text-sm mt-1">Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              {isOwnProfile ? "Your Posts" : `${user.username}'s Posts`}
            </h2>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full font-semibold">
              {posts.length} {posts.length === 1 ? "Post" : "Posts"}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-2xl text-gray-700 font-semibold mb-2">
                {isOwnProfile
                  ? "You haven't created any posts yet"
                  : "No posts yet"}
              </p>
              <p className="text-gray-500 mb-6">
                {isOwnProfile
                  ? "Share your first story with the community"
                  : "Check back later for new content"}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/create")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
