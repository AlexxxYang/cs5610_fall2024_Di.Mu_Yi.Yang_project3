import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-64">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        className="w-full pl-10 pr-4 py-2.5 border border-purple-200 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                 placeholder:text-gray-400 transition-all"
      />
      <Search 
        className="absolute left-3 top-2.5 text-gray-400" 
        size={20}
      />
    </form>
  );
};

export default SearchBar;