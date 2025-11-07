const CharacterImage = ({ characterId, characterName, size = 'md', className = '' }) => {
  if (!characterId || !characterName) {
    return (
      <div className={`bg-gray-300 rounded-full flex items-center justify-center ${getSizeClasses(size)} ${className}`}>
        <span className="text-gray-600 font-bold">?</span>
      </div>
    );
  }

  const imageUrl = `/images/characters/CharCommunity_${characterName}_S000.png`;

  return (
    <div className={`rounded-full overflow-hidden bg-gray-100 ${getSizeClasses(size)} ${className}`}>
      <img 
        src={imageUrl}
        alt={characterName}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center" style={{display: 'none'}}>
        <span className="text-gray-600 font-bold text-xs">
          {characterName?.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
};

const getSizeClasses = (size) => {
  switch (size) {
    case 'xs': return 'w-6 h-6 min-w-[24px] min-h-[24px]';
    case 'sm': return 'w-8 h-8 min-w-[32px] min-h-[32px]';
    case 'md': return 'w-12 h-12';
    case 'lg': return 'w-16 h-16';
    case 'xl': return 'w-20 h-20';
    default: return 'w-12 h-12';
  }
};

export default CharacterImage;