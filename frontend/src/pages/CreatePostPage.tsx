
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateBlogPost } from '../types/BlogPost';
import { blogPostApi } from '../services/api';
import { BlogPostForm } from '../components/BlogPostForm';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateBlogPost) => {
    try {
      await blogPostApi.create(data);
      navigate('/');
    } catch (err) {
      alert('Failed to create post. Please try again.');
      console.error(err);
    }
  };

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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Create New Post</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <BlogPostForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};