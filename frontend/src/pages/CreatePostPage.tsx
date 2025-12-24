import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateBlogPost } from '../types/BlogPost';
import { blogPostApi } from '../services/api';
import { BlogPostForm } from '../components/BlogPostForm';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: CreateBlogPost) => {
    setSubmitting(true);
    try {
      await blogPostApi.create(data);
      navigate('/', { state: { message: 'Post created successfully!' } });
    } catch (err) {
      alert('Failed to create post. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Feed
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Create New Post
          </h1>
          <p className="text-gray-600 text-lg">Share your thoughts and ideas with the community</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
          {submitting ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl text-gray-700 font-medium">Publishing your post...</p>
              <p className="text-gray-500 mt-2">This will only take a moment</p>
            </div>
          ) : (
            <BlogPostForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
          )}
        </div>

        {/* Inspiration Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Need inspiration?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/70 rounded-lg p-3">
              <p className="font-medium text-purple-800 mb-1">💭 Share a thought</p>
              <p className="text-gray-600">What's on your mind today?</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3">
              <p className="font-medium text-purple-800 mb-1">📚 Tell a story</p>
              <p className="text-gray-600">Everyone has a story to tell</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3">
              <p className="font-medium text-purple-800 mb-1">💡 Share knowledge</p>
              <p className="text-gray-600">Help others learn something new</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};