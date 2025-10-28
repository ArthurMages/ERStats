import { characters } from '../data/characters';
import CharacterImage from './CharacterImage';

const GameHistory = ({ playerData }) => {
  if (!playerData?.games?.userGames) return null;

  const games = playerData.games.userGames;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-black">Historique des parties récentes</h3>
        <p className="text-sm text-gray-600 mt-1">Dernières {games.length} parties</p>
      </div>
      <div className="divide-y divide-gray-100">
        {games.slice(0, 10).map((game, index) => {
          const isWin = game.gameRank === 1;
          const isTop3 = game.gameRank <= 3;
          
          return (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isWin ? 'bg-yellow-500' : isTop3 ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <span className="text-white font-bold text-sm">
                      #{game.gameRank || '?'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CharacterImage 
                      characterId={game.characterNum}
                      characterName={characters[game.characterNum]}
                      size="md"
                    />
                    <div>
                      <div className="font-medium text-black">
                        {characters[game.characterNum] || `Personnage #${game.characterNum}`}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                          {game.playerKill || 0} éliminations
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                          {game.playerAssistant || 0} assists
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full font-medium text-sm ${
                    isWin ? 'bg-yellow-100 text-yellow-800' : 
                    isTop3 ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {isWin ? '🏆 Victoire' : isTop3 ? 'Top 3' : `#${game.gameRank}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {game.matchingMode === 3 ? 'Classé' : 'Normal'}
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