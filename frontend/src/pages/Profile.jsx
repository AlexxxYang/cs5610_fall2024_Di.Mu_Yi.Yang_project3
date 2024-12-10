import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import UserPosts from '../components/UserPosts';  

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
  
      setUserData(prev => ({
        ...prev,
        status: status
      }));
    } catch (error) {

    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        {/* 顶部紫色背景装饰 */}
        <div className="h-24 bg-gradient-to-r from-purple-500 to-purple-400" />
        
        <div className="px-6 pb-6 -mt-8">
          {/* 用户头像 */}
          <div className="w-24 h-24 bg-purple-100 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-purple-600">
              {username?.[0]?.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-purple-900 mb-1">{username}</h1>
              {userData?.joinedAt && (
                <p className="text-gray-500 text-sm">
                  Joined {new Date(userData.joinedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {user?.username === username && (
              <div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-3">About</h2>
            {isEditing ? (
              <textarea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg resize-none h-32 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Write something about yourself..."
              />
            ) : (
              <div className="bg-purple-50 rounded-lg p-4 text-gray-700">
                {status ? (
                  <p className="whitespace-pre-wrap">{status}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">Posts</h2>
        <div className="space-y-4">
          <UserPosts username={username} />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-purple-600">Loading...</div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Profile;