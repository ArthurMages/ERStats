import CharacterImage from './CharacterImage';

const PlayerCard = ({ player, mostPlayedCharacter }) => {
  if (!player) return null;

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          {mostPlayedCharacter ? (
            <CharacterImage 
              characterId={mostPlayedCharacter.id}
              characterName={mostPlayedCharacter.name}
              size="xl"
              className="shadow-2xl ring-4 ring-white w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-red-500/30">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {player.nickname?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 break-words">
            {player.nickname}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold shadow-md border border-white/30 text-sm">
              ID: {player.userNum}
            </span>
            {mostPlayedCharacter && (
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full font-semibold shadow-md text-sm">
                Main: {mostPlayedCharacter.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;