
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { BlogPost, UpdateBlogPost } from '../types/BlogPost';
import { blogPostApi } from '../services/api';
import { BlogPostForm } from '../components/BlogPostForm';

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    try {
      const data = await blogPostApi.getById(parseInt(id));
      setPost(data);
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to load post. Redirecting to home.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateBlogPost) => {
    if (!id) return;
    try {
      await blogPostApi.update(parseInt(id), data);
      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Post</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <BlogPostForm
            initialData={{ title: post.title, content: post.content }}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isEditing
          />
        </div>
      </div>
    </div>
  );
};