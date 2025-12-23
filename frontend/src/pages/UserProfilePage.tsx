
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User } from '../types/Auth';
import type { BlogPost } from '../types/BlogPost';
import { authApi } from '../services/api';
import { blogPostApi } from '../services/api';
import { BlogPostCard } from '../components/BlogPostCard';
import { useAuth } from '../contexts/AuthContext';

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = currentUser?.id === Number(userId);

  useEffect(() => {
    // If a userId param is provided (visiting /user/:userId), fetch that user's profile.
    // If no userId param (visiting /profile), use the authenticated user's id.
    if (userId) {
      fetchUserData(userId);
      return;
    }

    if (currentUser) {
      fetchUserData(String(currentUser.id));
      return;
    }

    // No user id and no authenticated user: stop loading and redirect home.
    setLoading(false);
    navigate('/login');
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
      alert('Failed to load user profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await blogPostApi.delete(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Feed
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.username}</h1>
              {user.fullName && (
                <p className="text-lg text-gray-600 mb-2">{user.fullName}</p>
              )}
              <p className="text-gray-500 mb-3">{user.email}</p>
              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* User's Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isOwnProfile ? 'Your Posts' : `Posts by ${user.username}`} ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-xl text-gray-600">
                {isOwnProfile ? "You haven't created any posts yet" : 'This user has no posts yet'}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/create')}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
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