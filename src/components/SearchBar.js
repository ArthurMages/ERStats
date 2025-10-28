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
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Rechercher un joueur..."
          className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchBar;