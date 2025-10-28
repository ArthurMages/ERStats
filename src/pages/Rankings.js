import { useState, useEffect } from 'react';
import { getRankTop, getCurrentSeason, getPlayerMostPlayedCharacter } from '../services/api';
import { characters } from '../data/characters';
import CharacterImage from '../components/CharacterImage';

const getSeasonName = (seasonId) => {
  const seasonMap = {
    '35': 'Saison 9 (Actuelle)',
    '33': 'Saison 8', 
    '31': 'Saison 7',
    '29': 'Saison 6',
    '27': 'Saison 5',
    '25': 'Saison 4',
    '23': 'Saison 3',
    '21': 'Saison 2',
    '19': 'Saison 1'
  };
  return seasonMap[seasonId] || `Saison ${seasonId}`;
};

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('35');
  const teamMode = '3'; // Mode Squad fixe

  useEffect(() => {
    fetchRankings();
  }, [selectedSeason]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const data = await getRankTop(selectedSeason, teamMode);
      
      const players = data.topRanks || data.userRanks || data.data || [];
      
      // Récupérer le personnage le plus joué pour les 10 premiers joueurs seulement
      const playersWithCharacters = [];
      
      for (let i = 0; i < Math.min(10, players.length); i++) {
        const player = players[i];
        try {
          const mostPlayedCharId = await getPlayerMostPlayedCharacter(player.userNum, selectedSeason);
          playersWithCharacters.push({
            ...player,
            mostPlayedCharacter: mostPlayedCharId
          });
        } catch (error) {
          playersWithCharacters.push({
            ...player,
            mostPlayedCharacter: null
          });
        }
      }
      
      // Ajouter les joueurs restants sans personnage
      for (let i = 10; i < players.length; i++) {
        playersWithCharacters.push({
          ...players[i],
          mostPlayedCharacter: null
        });
      }
      
      setRankings(playersWithCharacters);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">Classements Squad</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="35">Saison 9 (Actuelle)</option>
              <option value="33">Saison 8</option>
              <option value="31">Saison 7</option>
              <option value="29">Saison 6</option>
              <option value="27">Saison 5</option>
              <option value="25">Saison 4</option>
              <option value="23">Saison 3</option>
              <option value="21">Saison 2</option>
              <option value="19">Saison 1</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Top 100 Joueurs - {getSeasonName(selectedSeason)}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {rankings.length > 0 ? rankings.slice(0, 100).map((player, index) => (
                <div key={index} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm ${
                        index < 3 ? 'bg-yellow-500' : index < 10 ? 'bg-gray-400' : 'bg-gray-300'
                      }`}>
                        #{index + 1}
                      </div>
                      <CharacterImage 
                        characterId={player.mostPlayedCharacter}
                        characterName={characters[player.mostPlayedCharacter]}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-black text-sm sm:text-base truncate">{player.nickname || 'Joueur inconnu'}</div>
                        <div className="text-xs sm:text-sm text-gray-600">MMR: {player.mmr || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-black text-sm sm:text-base">{player.lp || player.rank || 'N/A'}</div>
                      <div className="text-xs sm:text-sm text-gray-600">LP</div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-2">Aucune donnée disponible</div>
                  <div className="text-sm">Vérifiez votre clé API ou réessayez plus tard</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;