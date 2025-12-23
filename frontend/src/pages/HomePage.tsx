
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BlogPost } from '../types/BlogPost';
import { blogPostApi } from '../services/api';
import { BlogPostCard } from '../components/BlogPostCard';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogPostApi.getAll();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load blog posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await blogPostApi.delete(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      alert('Failed to delete post. Please try again.');
      console.error(err);
    }
  };

  // Flagging removed - handlers intentionally omitted

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header / Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Blog Platform</h1>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.username}!</span>
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate('/create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Post
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Social Feed</h2>
          <p className="text-gray-600 mt-2">Discover posts from our community</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">No blog posts yet. Be the first to create one!</p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/create')}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create First Post
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
  );
};