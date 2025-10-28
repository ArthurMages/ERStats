import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import PlayerCard from '../components/PlayerCard';
import PlayerStats from '../components/PlayerStats';
import GameHistory from '../components/GameHistory';
import { getPlayerFullData } from '../services/api';
import { characters } from '../data/characters';

const getMostPlayedCharacter = (gamesData) => {
  if (!gamesData?.userGames) return null;
  
  const characterCounts = {};
  gamesData.userGames.forEach(game => {
    const charId = game.characterNum;
    characterCounts[charId] = (characterCounts[charId] || 0) + 1;
  });
  
  const mostPlayed = Object.entries(characterCounts)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (!mostPlayed) return null;
  
  return {
    id: mostPlayed[0],
    name: characters[mostPlayed[0]] || `Personnage #${mostPlayed[0]}`,
    games: mostPlayed[1]
  };
};

const Home = () => {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (nickname) => {
    setLoading(true);
    setError('');
    try {
      const fullData = await getPlayerFullData(nickname);
      setPlayerData(fullData);
    } catch (err) {
      setError('Joueur non trouvé');
      setPlayerData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!playerData ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4">
                ER Stats
              </h1>
              <p className="text-gray-600 text-lg sm:text-xl mb-6 sm:mb-8 px-4">Statistiques détaillées pour Eternal Return</p>
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Statistiques détaillées</h3>
                    <p className="text-gray-600 text-sm">Winrate, MMR, historique complet</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Modes de jeu</h3>
                    <p className="text-gray-600 text-sm">Normal et Classé séparés</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Historique récent</h3>
                    <p className="text-gray-600 text-sm">Dernières parties avec détails</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Données temps réel</h3>
                    <p className="text-gray-600 text-sm">API officielle Eternal Return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <PlayerCard 
                player={playerData.user} 
                mostPlayedCharacter={getMostPlayedCharacter(playerData.games)}
              />
              <PlayerStats playerData={playerData} />
              <GameHistory playerData={playerData} />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
              <span className="text-gray-600">Chargement des données...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center mb-6">
            <div className="inline-block bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;