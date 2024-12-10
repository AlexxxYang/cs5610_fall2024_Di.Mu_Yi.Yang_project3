import React, { useState, useEffect } from 'react';
import { posts } from '../services/api';

const CreatePost = ({ onPostCreated, onCancel }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!content.trim() && !image) return;

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const response = await posts.create(formData);
      
    
      setContent('');
      setImage(null);
      setPreviewUrl(null);
      
      
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
     
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data ||
        'Failed to create post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows="3"
          disabled={isSubmitting}
        />

        <div className="flex items-center space-x-4">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 inline-block"
          >
            Upload Image
          </label>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
        
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreviewUrl(null);
              }}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Remove Image
            </button>
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={(!content.trim() && !image) || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;