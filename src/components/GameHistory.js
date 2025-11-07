import { useState } from 'react';
import { characters } from '../data/characters';
import CharacterImage from './CharacterImage';

const GameHistory = ({ playerData }) => {
  const [activeMode, setActiveMode] = useState('ranked');
  
  if (!playerData?.games?.userGames) return null;

  const allGames = playerData.games.userGames;
  const games = allGames.filter(game => 
    activeMode === 'ranked' ? game.matchingMode === 3 : game.matchingMode === 2
  );

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-xl">
      <div className="p-4 sm:p-6 border-b border-red-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">Historique des parties</h3>
            <p className="text-sm text-white/70 mt-1">Dernières {games.length} parties</p>
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
      <div className="divide-y divide-white/10">
        {games.slice(0, 10).map((game, index) => {
          const isWin = game.gameRank === 1;
          const isTop3 = game.gameRank <= 3;
          
          return (
            <div key={index} className="p-3 sm:p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isWin ? 'bg-yellow-500' : isTop3 ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <span className="text-white font-bold text-xs sm:text-sm">
                      #{game.gameRank || '?'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <CharacterImage 
                      characterId={game.characterNum}
                      characterName={characters[game.characterNum]}
                      size="md"
                      className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white text-sm sm:text-base truncate">
                        {characters[game.characterNum] || `Personnage #${game.characterNum}`}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-white/70 gap-1 sm:gap-0">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                          {game.playerKill || 0} K
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                          {game.playerAssistant || 0} A
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`px-2 py-1 sm:px-3 rounded-full font-medium text-xs sm:text-sm ${
                    isWin ? 'bg-yellow-500/20 text-yellow-300' : 
                    isTop3 ? 'bg-green-500/20 text-green-300' : 
                    'bg-white/10 text-white/70'
                  }`}>
                    {isWin ? '🏆' : isTop3 ? 'T3' : `#${game.gameRank}`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameHistory;