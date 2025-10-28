const PlayerStats = ({ playerData }) => {
  if (!playerData) return null;

  const { stats, ranks } = playerData;
  const rankedStats = stats?.ranked?.userStats?.[0];
  const normalStats = stats?.normal?.userStats?.[0];
  const rankedRank = ranks?.ranked?.userRank;

  const winrate = rankedStats?.totalGames ? (rankedStats.totalWins / rankedStats.totalGames) * 100 : 0;
  const normalWinrate = normalStats?.totalGames ? (normalStats.totalWins / normalStats.totalGames) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Statistiques générales</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-1">{(rankedStats?.totalGames || 0) + (normalStats?.totalGames || 0)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total parties</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">{(rankedStats?.totalWins || 0) + (normalStats?.totalWins || 0)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total victoires</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500 mb-1">
              {Math.round(((rankedStats?.totalWins || 0) + (normalStats?.totalWins || 0)) / ((rankedStats?.totalGames || 0) + (normalStats?.totalGames || 0)) * 100) || 0}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Winrate global</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">{rankedRank?.mmr || 'N/A'}</div>
            <div className="text-xs sm:text-sm text-gray-600">MMR Classé</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Ranked Stats */}
        {rankedStats && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-bold text-black">Mode Classé</h3>
              <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                Rang #{rankedRank?.rank || 'N/A'}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Parties jouées</span>
                <span className="font-bold text-black">{rankedStats.totalGames || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Victoires</span>
                <span className="font-bold text-green-600">{rankedStats.totalWins || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de victoire</span>
                <span className={`font-bold ${winrate >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                  {Math.round(winrate)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${winrate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(winrate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Normal Stats */}
        {normalStats && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-bold text-black">Mode Normal</h3>
              <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                Rang moyen: {normalStats.averageRank?.toFixed(1) || 'N/A'}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Parties jouées</span>
                <span className="font-bold text-black">{normalStats.totalGames || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Victoires</span>
                <span className="font-bold text-green-600">{normalStats.totalWins || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de victoire</span>
                <span className={`font-bold ${normalWinrate >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                  {Math.round(normalWinrate)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${normalWinrate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(normalWinrate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;