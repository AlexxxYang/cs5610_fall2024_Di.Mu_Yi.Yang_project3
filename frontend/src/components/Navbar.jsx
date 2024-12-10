import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar';  

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
    }
  };

  return (
    <nav className="bg-purple-50 shadow-sm border-b border-purple-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6 flex-1">
            <Link to="/" className="text-xl font-semibold text-purple-800 hover:text-purple-900">
              SeaSo
            </Link>
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center space-x-2 text-purple-700 hover:text-purple-900"
                >
                  <User size={20} />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
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