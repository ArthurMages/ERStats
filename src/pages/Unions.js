import { useState, useEffect } from 'react';
import { getCurrentSeason } from '../services/api';

const Unions = () => {
  const [unions, setUnions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnions();
  }, []);



  const fetchUnions = async () => {
    setLoading(true);
    try {
      const seasonId = await getCurrentSeason();
      // L'API Union nécessite un userNum spécifique
      // Pour l'instant, pas de données disponibles sans userNum
      console.log(`Union API requires specific userNum for season ${seasonId} - no global union rankings available`);
      setUnions([]);
    } catch (error) {
      console.error('Error fetching unions:', error);
      setUnions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">Classement des Unions</h1>
          <p className="text-sm sm:text-base text-gray-600">Les meilleures unions par serveur</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Top 50 Unions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {unions.map((union, index) => (
                <div key={index} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm ${
                        index < 3 ? 'bg-yellow-500' : index < 10 ? 'bg-gray-400' : 'bg-gray-300'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <span className="font-bold text-black text-sm sm:text-base truncate">{union.name}</span>
                          <span className="text-xs sm:text-sm text-gray-500">{union.tag}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">{union.members} membres</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-black text-sm sm:text-base">{union.avgMmr} MMR</div>
                      <div className="text-xs sm:text-sm text-gray-600">{union.wins} victoires</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unions;