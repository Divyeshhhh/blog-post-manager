import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { BlogPost } from '../types/BlogPost';
import { blogPostApi } from '../services/api';

export const ViewPostPage: React.FC = () => {
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
    } catch (err) {
      alert('Failed to load post. Redirecting to home.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Posts
        </button>
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <div className="text-sm text-gray-600 mb-6">
            By <span className="font-semibold">{post.author}</span> •{' '}
            {formatDate(post.createdAt)}
            {post.updatedAt !== post.createdAt && (
              <span> • Updated {formatDate(post.updatedAt)}</span>
            )}
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
          <div className="mt-8 flex gap-2">
            <button
              onClick={() => navigate(`/edit/${post.id}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Edit Post
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  try {
                    await blogPostApi.delete(post.id);
                    navigate('/');
                  } catch (err) {
                    alert('Failed to delete post.');
                  }
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Post
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};