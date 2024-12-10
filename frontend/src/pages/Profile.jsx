import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import UserPosts from '../components/UserPosts';  // 使用 UserPosts 替代 PostList

const Profile = ({ user }) => {
  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${username}`);
        setUserData(response.data);
        setStatus(response.data.status || '');
        setError(null);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleSave = async () => {
    try {
      await axios.put('/api/users/status', { status }, {
        withCredentials: true
      });
      setIsEditing(false);
      // 更新本地数据
      setUserData(prev => ({
        ...prev,
        status: status
      }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{username}</h1>
            {userData?.joinedAt && (
              <p className="text-gray-500 text-sm">
                Joined on: {new Date(userData.joinedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {user?.username === username && (
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          {isEditing ? (
            <textarea
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-lg resize-none h-24"
              placeholder="Update your status..."
            />
          ) : (
            <p className="text-gray-700">{status || 'No status update yet'}</p>
          )}
        </div>
      </div>

      {/* 替换这里：使用 UserPosts 替代 PostList */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <UserPosts username={username} />
      </div>
    </div>
  );
};

export default Profile;