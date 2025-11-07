import { useState, useEffect } from 'react';
import { getMetaData, getCurrentSeason } from '../services/api';
import { characters } from '../data/characters';
import CharacterImage from '../components/CharacterImage';

const CharacterStats = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('1');
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState(Object.entries(characters));

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

  useEffect(() => {
    const filtered = Object.entries(characters).filter(([id, name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCharacters(filtered);
  }, [searchTerm]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      <div className="bg-gradient-to-r from-red-700 to-black shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Statistiques
            </h1>
            <p className="text-red-100 text-lg mb-6">Découvrez les statistiques des personnages d'Eternal Return</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Selection */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Rechercher un personnage</h3>
              
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-red-500/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-4"
              />
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCharacters.map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCharacter(id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      selectedCharacter === id 
                        ? 'bg-red-600/30 border border-red-500/50' 
                        : 'bg-black/20 hover:bg-red-900/20 border border-transparent'
                    }`}
                  >
                    <CharacterImage 
                      characterId={id}
                      characterName={name}
                      size="sm"
                    />
                    <span className="text-white font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Character Stats */}
          <div className="lg:col-span-2">

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-6"></div>
                  <p className="text-white text-xl">Chargement des statistiques...</p>
                </div>
              </div>
            ) : characterData && (
              <div className="space-y-6">
                {/* Character Header */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <CharacterImage 
                      characterId={selectedCharacter}
                      characterName={characterData.name}
                      size="xl"
                    />
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{characterData.name}</h2>
                      <p className="text-white/70">Statistiques de base</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Combat</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Points de vie max</span>
                        <span className="font-bold text-red-400 text-lg">{characterData.maxHp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Points d'énergie max</span>
                        <span className="font-bold text-blue-400 text-lg">{characterData.maxSp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Puissance d'attaque</span>
                        <span className="font-bold text-orange-400 text-lg">{characterData.attackPower}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Défense</span>
                        <span className="font-bold text-green-400 text-lg">{characterData.defense}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Régénération</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Régén HP</span>
                        <span className="font-bold text-red-400 text-lg">{characterData.hpRegen}/s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Régén SP</span>
                        <span className="font-bold text-blue-400 text-lg">{characterData.spRegen}/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;