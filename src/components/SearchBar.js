import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSearch(nickname.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Rechercher un joueur (ex: OneCircle, Gwork...)" 
          className="w-full pl-12 pr-32 py-4 text-lg border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all bg-white shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-semibold shadow-md"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchBar;