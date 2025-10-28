import CharacterImage from './CharacterImage';

const PlayerCard = ({ player, mostPlayedCharacter }) => {
  if (!player) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {mostPlayedCharacter ? (
              <CharacterImage 
                characterId={mostPlayedCharacter.id}
                characterName={mostPlayedCharacter.name}
                size="xl"
                className="shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {player.nickname?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black mb-1">{player.nickname}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>ID: {player.userNum}</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">En ligne</span>
              {mostPlayedCharacter && (
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium">
                  Main: {mostPlayedCharacter.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Dernière activité</div>
          <div className="text-sm font-medium text-black">Aujourd'hui</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;