import { useState } from 'react';
import { getCharacterImageWithFallback } from '../utils/characterImages';

const CharacterImage = ({ characterId, characterName, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const { src, alt, fallback } = getCharacterImageWithFallback(characterId, characterName);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  if (imageError || !src) {
    return (
      <div className={`${sizeClasses[size]} bg-red-500 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-white font-bold text-xs">
          {fallback}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default CharacterImage;