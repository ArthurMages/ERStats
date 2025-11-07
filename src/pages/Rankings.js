import { useState, useEffect, useCallback, useRef } from 'react';
import { getRankTop, getUserStatsV2 } from '../services/api';
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



const PLAYERS_PER_PAGE = 10;

const Rankings = () => {
  const [allRankings, setAllRankings] = useState([]);
  const [displayedRankings, setDisplayedRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('35');

  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const teamMode = '3';

  const fetchInitialRankings = useCallback(async () => {
    setLoading(true);
    setAllRankings([]);
    setDisplayedRankings([]);
    setCurrentPage(0);
    setHasMore(true);
    
    try {
      const data = await getRankTop(selectedSeason, teamMode);
      const players = data.topRanks || data.userRanks || data.data || [];
      
      if (players.length === 0) {
        setAllRankings([]);
        setHasMore(false);
        return;
      }

      setAllRankings(players);
      
      // Afficher immédiatement les premiers joueurs sans personnages
      const initialPlayers = players.slice(0, PLAYERS_PER_PAGE).map((player, index) => ({
        ...player,
        rank: index + 1,
        top3Characters: []
      }));
      
      setDisplayedRankings(initialPlayers);
      setCurrentPage(1);
      setHasMore(players.length > PLAYERS_PER_PAGE);
      setLoading(false);
      
      // Charger les personnages pour tous les joueurs visibles
      loadCharactersForVisiblePlayers(initialPlayers);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setAllRankings([]);
      setHasMore(false);
      setLoading(false);
    }
  }, [selectedSeason]);

  const getTop3Characters = async (userNum) => {
    try {
      const stats = await getUserStatsV2(userNum, selectedSeason, 3);
      
      if (!stats?.userStats?.[0]?.characterStats) {
        return [];
      }
      
      const characterStats = stats.userStats[0].characterStats;
      const top3 = characterStats
        .sort((a, b) => b.totalGames - a.totalGames)
        .slice(0, 3)
        .map(char => char.characterCode);
      
      console.log('Top 3 characters for user', userNum, ':', top3, 'Names:', top3.map(id => characters[id]));
      return top3;
    } catch (error) {
      console.error('Error getting characters for user', userNum, ':', error);
      return [];
    }
  };

  const loadCharactersForVisiblePlayers = async (players) => {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      try {
        const top3Characters = await getTop3Characters(player.userNum);
        setDisplayedRankings(prev => {
          const updated = [...prev];
          const playerIndex = updated.findIndex(p => p.userNum === player.userNum);
          if (playerIndex !== -1) {
            updated[playerIndex] = { ...updated[playerIndex], top3Characters };
          }
          return updated;
        });
        // Délai entre chaque requête
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error loading characters for player ${player.userNum}:`, error);
      }
    }
  };

  const loadNextPage = async () => {
    if (loadingMore || !hasMore) return;
    
    const startIndex = currentPage * PLAYERS_PER_PAGE;
    const endIndex = startIndex + PLAYERS_PER_PAGE;
    const pageData = allRankings.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
      setHasMore(false);
      return;
    }

    setLoadingMore(true);
    
    const newPlayers = pageData.map((player, index) => ({
      ...player,
      rank: startIndex + index + 1,
      top3Characters: []
    }));
    
    setDisplayedRankings(prev => [...prev, ...newPlayers]);
    setCurrentPage(prev => prev + 1);
    setHasMore(endIndex < allRankings.length);
    setLoadingMore(false);
    
    // Charger les personnages pour les nouveaux joueurs
    loadCharactersForVisiblePlayers(newPlayers);
  };

  const lastPlayerElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, allRankings, currentPage]);

  useEffect(() => {
    fetchInitialRankings();
  }, [fetchInitialRankings]);

  const getRankBadgeStyle = (index) => {
    if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md';
    if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-md';
    if (index === 2) return 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-md';
    return 'bg-gradient-to-br from-gray-600 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-700 to-black shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Classements Squad
            </h1>
            <p className="text-red-100 text-lg mb-6">Les meilleurs joueurs d'Eternal Return</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <select 
                value={selectedSeason} 
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="px-6 py-3 bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                disabled={loading}
              >
                {SEASONS.map(season => (
                  <option key={season.id} value={season.id} className="text-black">
                    {season.name} {season.current ? '(Actuelle)' : ''}
                  </option>
                ))}
              </select>
              

              

            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-6"></div>
              <p className="text-white text-xl">Chargement du classement...</p>
            </div>
          </div>
        ) : displayedRankings.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-12 text-center">

            <h3 className="text-2xl font-bold text-white mb-4">Aucune donnée disponible</h3>
            <p className="text-white/70 text-lg">
              Pas de classement pour cette saison. Essayez une autre saison.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Rankings */}
            <div className="xl:col-span-3">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-red-500/30 bg-gradient-to-r from-red-600/20 to-transparent">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {SEASONS.find(s => s.id === selectedSeason)?.name}
                  </h2>
                  <p className="text-white/70 text-sm sm:text-base">Classement des meilleurs joueurs</p>
                </div>
                
                <div className="divide-y divide-red-900/30">
                  {displayedRankings.map((player, index) => {
                    const isLast = index === displayedRankings.length - 1;
                    const isTop3 = player.rank <= 3;
                    return (
                      <div 
                        key={player.userNum || index}
                        ref={isLast ? lastPlayerElementRef : null}
                        className={`p-3 sm:p-4 hover:bg-red-900/20 transition-all duration-300 ${isTop3 ? 'bg-gradient-to-r from-red-600/20 to-transparent' : ''}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-lg ${getRankBadgeStyle(player.rank - 1)}`}>
                              #{player.rank}
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-white text-base sm:text-lg mb-1">
                                {player.nickname || 'Joueur inconnu'}
                              </div>
                              
                              <div className="flex items-center space-x-2 sm:space-x-4 mb-2">
                                <span className="flex items-center text-blue-300">
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-1 sm:mr-2"></span>
                                  <span className="font-semibold text-sm sm:text-base">{player.mmr || 'N/A'}</span>
                                  <span className="ml-1 text-blue-200 text-sm sm:text-base">RP</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-start sm:justify-end">
                            {player.top3Characters && player.top3Characters.length > 0 ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-white/70 text-xs sm:text-sm mr-2 hidden sm:inline">Personnages:</span>
                                <div className="flex items-center space-x-1">
                                  {player.top3Characters.map((charId, charIndex) => (
                                    <div key={charIndex} className="flex items-center space-x-1">
                                      <CharacterImage 
                                        characterId={charId}
                                        characterName={characters[charId] || `Char${charId}`}
                                        size="xs"
                                      />
                                      <span className="text-white/80 text-xs hidden sm:inline">{characters[charId] || `#${charId}`}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <span className="text-white/70 text-xs sm:text-sm mr-2 hidden sm:inline">Chargement...</span>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-900/40 rounded-full animate-pulse"></div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-900/40 rounded-full animate-pulse"></div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-900/40 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {loadingMore && (
                    <div className="p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-4"></div>
                      <p className="text-white/70">Chargement des joueurs suivants...</p>
                    </div>
                  )}
                  
                  {!hasMore && displayedRankings.length > 0 && (
                    <div className="p-6 text-center">
                      <p className="text-white/50">Tous les joueurs ont été chargés</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar Stats */}
            <div className="xl:col-span-1 space-y-4 lg:space-y-6">
              {/* Top 3 Podium */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                  Podium
                </h3>
                <div className="space-y-3">
                  {displayedRankings.slice(0, 3).map((player, index) => (
                    <div key={player.userNum} className={`p-3 rounded-xl ${index === 0 ? 'bg-yellow-500/20' : index === 1 ? 'bg-gray-400/20' : 'bg-orange-600/20'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${getRankBadgeStyle(index)}`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{player.nickname}</div>
                          <div className="text-white/70 text-xs">{player.mmr} RP</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Season Info */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                  Statistiques
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Saison actuelle</span>
                    <span className="text-white font-semibold">{SEASONS.find(s => s.id === selectedSeason)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total joueurs</span>
                    <span className="text-white font-semibold">{allRankings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Affichés</span>
                    <span className="text-white font-semibold">{displayedRankings.length}</span>
                  </div>
                  {displayedRankings.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/70">RP moyen</span>
                        <span className="text-white font-semibold">
                          {Math.round(displayedRankings.reduce((sum, p) => sum + (p.mmr || 0), 0) / displayedRankings.length)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">RP max</span>
                        <span className="text-white font-semibold">
                          {Math.max(...displayedRankings.map(p => p.mmr || 0))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Progress */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Progression</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Chargement</span>
                    <span className="text-white">{Math.round((displayedRankings.length / allRankings.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(displayedRankings.length / allRankings.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;