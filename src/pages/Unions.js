import { useState } from 'react';
import { searchUser, getCurrentSeason, getUnionTeams } from '../services/api';

const Unions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [unionData, setUnionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setPlayerData(null);
    setUnionData(null);
    
    try {
      const userData = await searchUser(searchTerm);
      
      if (!userData || !userData.user) {
        setError('Joueur non trouvé');
        return;
      }
      
      setPlayerData(userData.user);
      
      const seasonId = await getCurrentSeason();
      const unionResponse = await getUnionTeams(userData.user.userNum, seasonId);
      
      if (unionResponse && unionResponse.teams && unionResponse.teams.length > 0) {
        setUnionData(unionResponse.teams[0]);
      } else {
        setError('Ce joueur n\'est dans aucune union');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      <div className="bg-gradient-to-r from-red-700 to-black shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Recherche d'Union
            </h1>
            <p className="text-red-100 text-lg mb-6">Trouvez l'union d'un joueur</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="text"
                placeholder="Nom du joueur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-6 py-3 bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchTerm.trim()}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
            <p className="text-red-300 text-lg">{error}</p>
          </div>
        )}
        
        {playerData && (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 overflow-hidden mb-8">
            <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-600/20 to-transparent">
              <h2 className="text-2xl font-bold text-white mb-2">Joueur trouvé</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{playerData.nickname?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{playerData.nickname}</h3>
                  <p className="text-white/70">ID: {playerData.userNum}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {unionData && (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/30 overflow-hidden">
            <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-600/20 to-transparent">
              <h2 className="text-2xl font-bold text-white mb-2">Union du joueur</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">{unionData.tnm}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Membres</span>
                      <span className="text-white font-semibold">{unionData.ti}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Victoires</span>
                      <span className="text-green-400 font-semibold">{unionData.stw || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Défaites</span>
                      <span className="text-red-400 font-semibold">{unionData.ssstls || 0}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Informations</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Rang moyen</span>
                      <span className="text-white font-semibold">{unionData.avgrnk || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Parties totales</span>
                      <span className="text-white font-semibold">{unionData.tgs || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unions;