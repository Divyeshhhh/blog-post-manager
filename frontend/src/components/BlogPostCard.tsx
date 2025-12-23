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
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        {/* Author Info */}
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
            onClick={() => navigate(`/user/${post.userId}`)}
          >
            {post.user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p
              className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
              onClick={() => navigate(`/user/${post.userId}`)}
            >
              {post.user.username}
            </p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Post Content */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            View
          </button>

          {post.isOwner && (
            <>
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
            </>
          )}

          {/* No flagging UI - feature removed */}
        </div>
      </div>
      
    </>
  );
};