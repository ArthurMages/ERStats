import { characterImageNames } from '../data/characterImageNames';

// Utilitaire pour gérer les images des personnages
export const getCharacterImage = (characterId) => {
  const imageName = characterImageNames[characterId];
  if (!imageName) return null;
  
  return `/images/characters/CharCommunity_${imageName}_S000.png`;
};

export const getCharacterImageWithFallback = (characterId, characterName) => {
  const imagePath = getCharacterImage(characterId);
  
  return {
    src: imagePath,
    alt: characterName,
    fallback: characterName?.charAt(0)?.toUpperCase() || '?'
  };
};