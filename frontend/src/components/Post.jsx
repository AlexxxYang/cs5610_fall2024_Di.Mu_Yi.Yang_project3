import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { posts } from '../services/api';

const Post = ({ post, onDelete, onUpdate, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const isAuthor = currentUser && currentUser.username === post.author;

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

     
      if (!editContent.trim()) {
        setError('Content cannot be empty');
        return;
      }


      const response = await posts.update(post._id, editContent);
   

     
      if (onUpdate) {
        onUpdate(post._id, response.data);
      }
      
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsSubmitting(true);
        
        const response = await posts.delete(post._id);
   

        if (response.data) {
          
          if (onDelete) {
            onDelete(post._id);
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete post');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(post.content);
      setError('');
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleEdit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/profile/${post.author}`}
            className="font-semibold text-purple-700 hover:text-purple-900 transition-colors"
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
                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
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
            className="w-full p-2 border rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            rows="3"
            placeholder="What's happening?"
            disabled={isSubmitting}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words">{post.content}</p>
        )}
      </div>

      {post.image && (
  <div className="mt-3">
    <a 
      href={post.image} 
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group w-fit" // 改为 w-fit 使容器适应图片大小
    >
      <img 
        src={post.image} 
        alt="Post attachment"
        className="max-w-full rounded-lg border border-purple-100"
        style={{ maxHeight: '400px', objectFit: 'contain' }}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-lg" />
      <ImageIcon 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-70 transition-opacity"
        size={24} 
      />
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