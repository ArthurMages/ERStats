import { useState, useEffect } from 'react';
import { characters } from '../data/characters';
import { getWeaponRoutes, getCurrentSeason } from '../services/api';
import CharacterImage from '../components/CharacterImage';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, [selectedCharacter]);



  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const seasonId = await getCurrentSeason();
      const data = await getWeaponRoutes();
      console.log(`Weapon routes data for season ${seasonId}:`, data);
      
      // Traiter les données réelles de l'API
      if (data && data.data) {
        const processedRoutes = data.data.map((route, index) => ({
          id: route.routeId || index + 1,
          name: route.name || `Route ${index + 1}`,
          character: characters[selectedCharacter],
          popularity: route.popularity || 0,
          winRate: route.winRate || 0,
          items: route.items || [],
          areas: route.areas || [],
          difficulty: route.difficulty || 'Inconnu'
        }));
        setRoutes(processedRoutes);
      } else {
        setRoutes([]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">Itinéraires Populaires</h1>
          <p className="text-sm sm:text-base text-gray-600">Les meilleurs plans par personnage</p>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {routes.map((route) => (
              <div key={route.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                  <div className="flex items-center space-x-3 flex-1">
                    <CharacterImage 
                      characterId={selectedCharacter}
                      characterName={route.character}
                      size="md"
                    />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-black">{route.name}</h3>
                      <p className="text-sm sm:text-base text-gray-600">{route.character}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-sm text-gray-500">Popularité</div>
                    <div className="font-bold text-red-500">{route.popularity}%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Statistiques</div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
                      <span>Taux de victoire: <span className="font-bold">{route.winRate}%</span></span>
                      <span>Difficulté: <span className={`font-bold ${
                        route.difficulty === 'Facile' ? 'text-green-600' :
                        route.difficulty === 'Moyen' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{route.difficulty}</span></span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Objets recommandés</div>
                    <div className="flex flex-wrap gap-2">
                      {route.items.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Zones recommandées</div>
                    <div className="flex flex-wrap gap-2">
                      {route.areas.map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Routes;