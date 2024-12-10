import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { users } from '../services/api';
import { User } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchTerm = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) return;
      
      try {
        setLoading(true);
        const response = await users.search(searchTerm);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-gray-500">Searching...</div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-8 text-center">
      {error}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Search results for "{searchTerm}"
      </h2>
      
      {results.length === 0 ? (
        <div className="text-gray-500 text-center p-8">
          No users found matching "{searchTerm}"
        </div>
      ) : (
        <div className="space-y-4">
          {results.map(user => (
            <Link
              key={user._id}
              to={`/profile/${user.username}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-gray-500 text-sm">
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                  {user.description && (
                    <p className="text-gray-600 mt-1">{user.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;