import { useState, useEffect } from 'react';
import { getMetaData, getCurrentSeason } from '../services/api';
import { characters } from '../data/characters';
import CharacterImage from '../components/CharacterImage';

const CharacterStats = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('1');
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCharacterStats = async (characterId) => {
    setLoading(true);
    try {
      const seasonId = await getCurrentSeason();
      const data = await getMetaData('Character');
      console.log(`Character data for season ${seasonId}:`, data);
      
      // Traiter les données réelles de l'API
      if (data && data.data && data.data.length > 0) {
        console.log('First character in API:', data.data[0]);
        console.log('Looking for character ID:', characterId);
        
        const characterInfo = data.data.find(char => 
          char.characterCode == characterId || 
          char.code == characterId || 
          char.id == characterId
        );
        
        console.log('Found character:', characterInfo);
        
        if (characterInfo) {
          setCharacterData({
            name: characterInfo.name || characters[characterId],
            maxHp: characterInfo.maxHp || 'N/A',
            maxSp: characterInfo.maxSp || 'N/A',
            attackPower: characterInfo.attackPower || 'N/A',
            defense: characterInfo.defense || 'N/A',
            hpRegen: characterInfo.hpRegen || 'N/A',
            spRegen: characterInfo.spRegen || 'N/A'
          });
        } else {
          setCharacterData({
            name: characters[characterId],
            maxHp: 'N/A',
            maxSp: 'N/A',
            attackPower: 'N/A',
            defense: 'N/A',
            hpRegen: 'N/A',
            spRegen: 'N/A'
          });
        }
      } else {
        setCharacterData({
          name: characters[characterId],
          maxHp: 'N/A',
          maxSp: 'N/A',
          attackPower: 'N/A',
          defense: 'N/A',
          hpRegen: 'N/A',
          spRegen: 'N/A'
        });
      }
    } catch (error) {
      console.error('Error fetching character stats:', error);
      setCharacterData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterStats(selectedCharacter);
  }, [selectedCharacter]);



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-6 sm:mb-8">Statistiques des Personnages</h1>
        
        <div className="mb-6">
          <select 
            value={selectedCharacter} 
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {Object.entries(characters).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : characterData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <CharacterImage 
                  characterId={selectedCharacter}
                  characterName={characterData.name}
                  size="xl"
                />
                <h3 className="text-xl font-bold text-black">{characterData.name}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Points de vie max</span>
                  <span className="font-bold text-red-500">{characterData.maxHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points d'énergie max</span>
                  <span className="font-bold text-blue-500">{characterData.maxSp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Puissance d'attaque</span>
                  <span className="font-bold text-orange-500">{characterData.attackPower}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Défense</span>
                  <span className="font-bold text-green-500">{characterData.defense}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-4">Régénération</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Régén HP</span>
                  <span className="font-bold text-red-500">{characterData.hpRegen}/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Régén SP</span>
                  <span className="font-bold text-blue-500">{characterData.spRegen}/s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterStats;