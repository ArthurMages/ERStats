import { useState, useEffect, useCallback } from 'react';
import { getRankTop, getPlayerMostPlayedCharacter } from '../services/api';
import { characters } from '../data/characters';
import CharacterImage from '../components/CharacterImage';

const SEASONS = [
  { id: '35', name: 'Saison 9', current: true },
  { id: '33', name: 'Saison 8', current: false },
  { id: '31', name: 'Saison 7', current: false },
  { id: '29', name: 'Saison 6', current: false },
  { id: '27', name: 'Saison 5', current: false },
  { id: '25', name: 'Saison 4', current: false },
  { id: '23', name: 'Saison 3', current: false },
  { id: '21', name: 'Saison 2', current: false },
  { id: '19', name: 'Saison 1', current: false }
];

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('35');
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const teamMode = '3';

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    setRankings([]);
    
    try {
      const data = await getRankTop(selectedSeason, teamMode);
      const players = data.topRanks || data.userRanks || data.data || [];
      
      if (players.length === 0) {
        console.warn('No ranking data available for season', selectedSeason);
        setRankings([]);
        return;
      }

      // Afficher d'abord les joueurs sans personnages
      setRankings(players.map(p => ({ ...p, mostPlayedCharacter: null })));
      
      // Charger les personnages en arrière-plan pour les top 10
      setLoadingCharacters(true);
      const top10 = players.slice(0, 10);
      
      for (let i = 0; i < top10.length; i++) {
        try {
          const charId = await getPlayerMostPlayedCharacter(top10[i].userNum, selectedSeason);
          setRankings(prev => {
            const updated = [...prev];
            const playerIndex = updated.findIndex(p => p.userNum === top10[i].userNum);
            if (playerIndex !== -1) {
              updated[playerIndex] = { ...updated[playerIndex], mostPlayedCharacter: charId };
            }
            return updated;
          });
        } catch (error) {
          console.warn(`Could not fetch character for player ${i + 1}:`, error.message);
        }
      }
      
      setLoadingCharacters(false);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSeason]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const getRankBadgeStyle = (index) => {
    if (index < 3) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md';
    if (index < 10) return 'bg-gradient-to-br from-gray-300 to-gray-500';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
            Classements Squad
          </h1>
          <p className="text-gray-600 mb-4">Top 100 des meilleurs joueurs</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              disabled={loading}
            >
              {SEASONS.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name} {season.current ? '(Actuelle)' : ''}
                </option>
              ))}
            </select>
            
            {loadingCharacters && (
              <div className="flex items-center text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                Chargement des personnages...
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du classement...</p>
            </div>
          </div>
        ) : rankings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-black mb-2">Aucune donnée disponible</h3>
            <p className="text-gray-600">
              Pas de classement pour cette saison. Essayez une autre saison.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">
                  Top 100 Joueurs - {SEASONS.find(s => s.id === selectedSeason)?.name}
                </h2>
                <div className="text-sm text-gray-600">
                  {rankings.length} joueur{rankings.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {rankings.slice(0, 100).map((player, index) => (
                <div 
                  key={player.userNum || index} 
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm ${getRankBadgeStyle(index)}`}>
                        #{index + 1}
                      </div>
                      
                      <CharacterImage 
                        characterId={player.mostPlayedCharacter}
                        characterName={characters[player.mostPlayedCharacter]}
                        size="md"
                        className="flex-shrink-0"
                      />
                      
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-black text-sm sm:text-base truncate">
                          {player.nickname || 'Joueur inconnu'}
                        </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                            MMR: {player.mmr || 'N/A'}
                          </span>
                          {player.mostPlayedCharacter && (
                            <span className="text-gray-400">•</span>
                          )}
                          {player.mostPlayedCharacter && (
                            <span className="truncate">
                              {characters[player.mostPlayedCharacter]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="font-bold text-black text-sm sm:text-base">
                        {player.lp || player.rank || 'N/A'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">LP</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;