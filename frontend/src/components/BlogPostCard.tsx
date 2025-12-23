import React from 'react';
import type { BlogPost } from '../types/BlogPost';
import { useNavigate } from 'react-router-dom';

interface Props {
  post: BlogPost;
  onDelete: (id: number) => void;
}

export const BlogPostCard: React.FC<Props> = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
      <p className="text-sm text-gray-600 mb-3">
        By {post.author} • {formatDate(post.createdAt)}
      </p>
      <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/post/${post.id}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/edit/${post.id}`)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              onDelete(post.id);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};