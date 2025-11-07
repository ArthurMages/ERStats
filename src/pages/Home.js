import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (nickname) {
      handleSearch(nickname);
    }
  }, [nickname]);

  const handleSearch = async (searchNickname) => {
    setLoading(true);
    setError('');
    try {
      const fullData = await getPlayerFullData(searchNickname);
      setPlayerData(fullData);
      navigate(`/player/${searchNickname}`, { replace: true });
    } catch (err) {
      setError('Joueur non trouvé');
      setPlayerData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {!playerData ? (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-red-700 to-black shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                  ER Stats
                </h1>
                <p className="text-red-100 text-xl mb-8">Statistiques détaillées pour Eternal Return</p>
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Fonctionnalités</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📊</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">Statistiques détaillées</h3>
                    <p className="text-white/70">Winrate, RP, historique complet des parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">🎮</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">Modes de jeu</h3>
                    <p className="text-white/70">Normal et Classé avec données séparées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📈</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">Classements</h3>
                    <p className="text-white/70">Top joueurs par mode et saison</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">Données temps réel</h3>
                    <p className="text-white/70">API officielle Eternal Return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="space-y-6">
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-6"></div>
            <p className="text-white text-xl">Chargement des données...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="inline-block bg-red-900/30 border border-red-500/50 text-red-300 px-6 py-3 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;