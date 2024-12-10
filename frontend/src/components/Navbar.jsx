import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar';  // 确保这行导入存在

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 修改这里的flex布局 */}
          <div className="flex items-center space-x-6 flex-1">
            <Link to="/" className="text-xl font-semibold text-gray-800">
              Home
            </Link>
            {/* 确保SearchBar在这里渲染 */}
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <User size={20} />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus size={20} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;