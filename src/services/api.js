import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
const API_KEY = process.env.REACT_APP_BSER_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL
});

// Délai entre les requêtes pour éviter rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1500; // 1500ms (1.5 secondes) entre les requêtes

api.interceptors.request.use(async (request) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  console.log('API Request:', request.method?.toUpperCase(), request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const searchUser = async (nickname) => {
  console.log('Searching for user:', nickname);
  
  try {
    const response = await api.get(`/v1/user/nickname?query=${encodeURIComponent(nickname)}`);
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserStats = async (userNum, seasonId) => {
  const response = await api.get(`/v1/user/stats/${userNum}/${seasonId}`);
  return response.data;
};

export const getUserStatsV2 = async (userNum, seasonId, matchingMode) => {
  const response = await api.get(`/v2/user/stats/${userNum}/${seasonId}/${matchingMode}`);
  return response.data;
};

export const getUserGames = async (userNum, next = 0) => {
  // Récupérer les parties les plus récentes (toutes saisons confondues)
  const response = await api.get(`/v1/user/games/${userNum}${next ? `?next=${next}` : ''}`);
  return response.data;
};

let cachedSeason = null;

export const getCurrentSeason = async () => {
  if (cachedSeason) return cachedSeason;
  
  // Utiliser la saison 35 qui contient des données récentes
  cachedSeason = 35;
  console.log('Using season 35 (most recent with data)');
  return cachedSeason;
};

export const getRankTop = async (seasonId, matchingTeamMode) => {
  const response = await api.get(`/v1/rank/top/${seasonId}/${matchingTeamMode}`);
  if (response.data.code === 404) {
    return { topRanks: [] };
  }
  return response.data;
};

export const getPlayerMostPlayedCharacter = async (userNum, seasonId) => {
  try {
    const stats = await getUserStatsV2(userNum, seasonId, 3);
    
    if (!stats?.userStats?.[0]?.characterStats) {
      return null;
    }
    
    const characterStats = stats.userStats[0].characterStats;
    const mostPlayed = characterStats.reduce((max, char) => 
      char.totalGames > (max?.totalGames || 0) ? char : max, null
    );
    
    return mostPlayed?.characterCode || null;
  } catch (error) {
    return null;
  }
};

export const getUserRank = async (userNum, seasonId, matchingTeamMode) => {
  const response = await api.get(`/v1/rank/${userNum}/${seasonId}/${matchingTeamMode}`);
  return response.data;
};

export const getPlayerFullData = async (nickname) => {
  try {
    console.log('Getting full data for:', nickname);
    const userData = await searchUser(nickname);
    
    console.log('User data received:', userData);
    
    if (!userData || !userData.user) {
      console.log('No user found in response');
      throw new Error('Joueur non trouvé');
    }
    
    const { userNum } = userData.user;
    console.log('User number:', userNum);
    
    const seasonId = await getCurrentSeason();
    
    // Mode 2 = Normal Squad, Mode 3 = Ranked Squad
    let normalStats, rankedStats, userGames, normalRank, rankedRank;
    
    try { normalStats = await getUserStatsV2(userNum, seasonId, 2); } catch (e) { normalStats = null; }
    try { rankedStats = await getUserStatsV2(userNum, seasonId, 3); } catch (e) { rankedStats = null; }
    try { userGames = await getUserGames(userNum); } catch (e) { userGames = null; }
    try { normalRank = await getUserRank(userNum, seasonId, 2); } catch (e) { normalRank = null; }
    try { rankedRank = await getUserRank(userNum, seasonId, 3); } catch (e) { rankedRank = null; }
    
    console.log('Additional data fetched:', {
      normalStats: !!normalStats,
      rankedStats: !!rankedStats,
      userGames: !!userGames,
      normalRank: !!normalRank,
      rankedRank: !!rankedRank
    });
    
    return {
      user: userData.user,
      stats: {
        normal: normalStats,
        ranked: rankedStats
      },
      games: userGames,
      ranks: {
        normal: normalRank,
        ranked: rankedRank
      }
    };
  } catch (error) {
    console.error('Full data error:', error);
    throw error;
  }
};

export const getGameData = async (gameId) => {
  const response = await api.get(`/v1/games/${gameId}`);
  return response.data;
};

export const getMetaData = async (metaType) => {
  const response = await api.get(`/v1/data/${metaType}`);
  return response.data;
};

export const getFreeCharacters = async (matchingMode) => {
  const response = await api.get(`/v1/freeCharacters/${matchingMode}`);
  return response.data;
};

export const getWeaponRoutes = async () => {
  const response = await api.get('/v1/weaponRoutes/recommend');
  return response.data;
};

export const getWeaponRoute = async (routeId) => {
  const response = await api.get(`/v1/weaponRoutes/recommend/${routeId}`);
  return response.data;
};

export const getUnionTeams = async (userNum, seasonId) => {
  const response = await api.get(`/v1/unionTeam/${userNum}/${seasonId}`);
  return response.data;
};

