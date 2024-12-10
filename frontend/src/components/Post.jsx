import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { posts } from '../services/api';

const Post = ({ post, onDelete, onUpdate, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查当前用户是否是帖子作者
  const isAuthor = currentUser && currentUser.username === post.author;

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // 验证输入
      if (!editContent.trim()) {
        setError('Content cannot be empty');
        return;
      }

      console.log('Starting update with:', {
        postId: post._id,
        content: editContent
      });

      const response = await posts.update(post._id, editContent);
      console.log('Update successful:', response.data);

      // 更新父组件中的数据
      if (onUpdate) {
        onUpdate(post._id, response.data);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', {
        error: err,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsSubmitting(true);
        console.log('Attempting to delete post:', {
          postId: post._id,
          author: post.author,
          currentUser: currentUser?.username
        });

        const response = await posts.delete(post._id);
        console.log('Delete response:', response);

        if (response.data) {
          console.log('Post deleted successfully');
          // 通知父组件更新列表
          if (onDelete) {
            onDelete(post._id);
          }
        }
      } catch (err) {
        console.error('Delete failed:', {
          error: err,
          response: err.response,
          data: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.error || 'Failed to delete post');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    // 按 Esc 取消编辑
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(post.content);
      setError('');
    }
    // 按 Ctrl+Enter 或 Cmd+Enter 提交更新
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleEdit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/profile/${post.author}`}
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {post.author}
          </Link>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
            {post.updatedAt !== post.createdAt && ' (edited)'}
          </p>
        </div>

        {isAuthor && !isSubmitting && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Save changes"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(post.content);
                    setError('');
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Cancel editing"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  title="Edit post"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-3">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            rows="3"
            placeholder="What's on your mind?"
            disabled={isSubmitting}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words">{post.content}</p>
        )}
      </div>

      {post.image && (
  <div className="mt-3 relative group">
    <img 
      src={post.image} // 直接使用完整的S3 URL
      alt="Post attachment"
      className="max-w-full rounded-lg border border-gray-200"
      style={{ maxHeight: '400px', objectFit: 'contain' }}
    />
    <a 
      href={post.image} // 直接使用完整的S3 URL
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all"
    >
      <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-all" size={24} />
    </a>
  </div>
)}
      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      {isEditing && (
        <div className="mt-2 text-xs text-gray-500">
          Press Esc to cancel • Ctrl+Enter to save
        </div>
      )}

      {isSubmitting && (
        <div className="mt-2 text-sm text-gray-500">
          Processing...
        </div>
      )}
    </div>
  );
};

export default Post;