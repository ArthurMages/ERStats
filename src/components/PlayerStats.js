import { useState } from 'react';

const PlayerStats = ({ playerData }) => {
  const [activeMode, setActiveMode] = useState('ranked');
  
  if (!playerData) return null;

  const { ranks, games } = playerData;
  const rankedRank = ranks?.ranked?.userRank;
  const normalRank = ranks?.normal?.userRank;

  const getRecentStats = (mode) => {
    if (!games?.userGames) return null;
    
    const modeGames = games.userGames.filter(game => 
      mode === 'ranked' ? game.matchingMode === 3 : game.matchingMode === 2
    ).slice(0, 20);
    
    if (modeGames.length === 0) return null;
    
    const wins = modeGames.filter(game => game.gameRank === 1).length;
    const top3 = modeGames.filter(game => game.gameRank <= 3).length;
    const totalKills = modeGames.reduce((sum, game) => sum + (game.playerKill || 0), 0);
    const totalAssists = modeGames.reduce((sum, game) => sum + (game.playerAssistant || 0), 0);
    const avgRank = modeGames.reduce((sum, game) => sum + (game.gameRank || 18), 0) / modeGames.length;
    
    return {
      totalGames: modeGames.length,
      totalWins: wins,
      top3Rate: (top3 / modeGames.length) * 100,
      avgKills: totalKills / modeGames.length,
      avgAssists: totalAssists / modeGames.length,
      avgRank: avgRank
    };
  };

  const currentStats = getRecentStats(activeMode);
  const currentRank = activeMode === 'ranked' ? rankedRank : normalRank;
  const winrate = currentStats?.totalGames ? (currentStats.totalWins / currentStats.totalGames) * 100 : 0;

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-xl">
      <div className="p-4 sm:p-6 border-b border-red-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">Statistiques</h3>
            <p className="text-sm text-white/70 mt-1">20 dernières parties</p>
          </div>
          <div className="flex bg-white/10 rounded-lg p-1 mx-auto sm:mx-0">
            <button
              onClick={() => setActiveMode('ranked')}
              className={`px-2 py-1 sm:px-3 rounded-md font-medium text-xs sm:text-sm transition-all ${
                activeMode === 'ranked'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Classé
            </button>
            <button
              onClick={() => setActiveMode('normal')}
              className={`px-2 py-1 sm:px-3 rounded-md font-medium text-xs sm:text-sm transition-all ${
                activeMode === 'normal'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Normal
            </button>
          </div>
        </div>
      </div>

      {currentStats ? (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{currentStats.totalGames || 0}</div>
              <div className="text-xs sm:text-sm text-white/70">Parties jouées</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mb-1">{currentStats.totalWins || 0}</div>
              <div className="text-xs sm:text-sm text-white/70">Victoires</div>
            </div>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 ${
                currentStats.top3Rate >= 50 ? 'text-green-400' : 'text-red-400'
              }`}>
                {Math.round(currentStats.top3Rate)}%
              </div>
              <div className="text-xs sm:text-sm text-white/70">Top 3</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-1">
                {currentStats.avgRank.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-white/70">Rang moyen</div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">{currentStats.avgKills.toFixed(1)}</div>
              <div className="text-xs sm:text-sm text-white/70">Éliminations/partie</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-1">{currentStats.avgAssists.toFixed(1)}</div>
              <div className="text-xs sm:text-sm text-white/70">Assists/partie</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="text-center py-8">
            <p className="text-white/70">Aucune donnée disponible pour le mode {activeMode === 'ranked' ? 'Classé' : 'Normal'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;