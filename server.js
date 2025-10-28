const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Validation de la clé API
const API_KEY = process.env.BSER_API_KEY;
if (!API_KEY) {
  console.error('❌ ERREUR: BSER_API_KEY n\'est pas définie dans les variables d\'environnement');
  process.exit(1);
}

const BSER_API = 'https://open-api.bser.io';

// Rate limiter amélioré avec gestion d'erreurs robuste
class RateLimiter {
  constructor(requestsPerSecond = 0.8, maxRetries = 3) {
    this.queue = [];
    this.processing = false;
    this.interval = 1000 / requestsPerSecond;
    this.lastRequestTime = 0;
    this.maxRetries = maxRetries;
  }

  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject, retries: 0 });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.interval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.interval - timeSinceLastRequest)
        );
      }
      
      const task = this.queue.shift();
      this.lastRequestTime = Date.now();
      
      try {
        const result = await fn();
        task.resolve(result);
      } catch (error) {
        // Retry logic pour les erreurs 429 (rate limit)
        if (error.response?.status === 429 && task.retries < this.maxRetries) {
          task.retries++;
          console.log(`⚠️  Rate limit hit, retry ${task.retries}/${this.maxRetries}`);
          this.queue.unshift(task); // Remettre en début de queue
          await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2s
        } else {
          task.reject(error);
        }
      }
    }
    
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter(0.8);

// Cache simple pour réduire les appels API
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url) {
  return url;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Nettoyer le cache si trop gros
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

app.use('/api', async (req, res) => {
  try {
    const path = req.path;
    const queryString = req.url.split('?')[1] || '';
    const url = `${BSER_API}${path}${queryString ? '?' + queryString : ''}`;
    
    console.log('📡 Proxying request to:', url);
    
    // Vérifier le cache
    const cacheKey = getCacheKey(url);
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      console.log('✅ Serving from cache');
      return res.json(cachedData);
    }
    
    const response = await rateLimiter.execute(async () => {
      return await axios.get(url, {
        headers: {
          'x-api-key': API_KEY
        },
        timeout: 15000,
        validateStatus: (status) => status < 500 // Ne pas rejeter 4xx
      });
    });
    
    // Mettre en cache si succès
    if (response.status === 200) {
      setCache(cacheKey, response.data);
    }
    
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    
    console.error('❌ Proxy error:', {
      status,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      url: req.url
    });
    
    let userMessage = 'Erreur serveur';
    
    if (status === 404) {
      userMessage = 'Données non trouvées';
    } else if (status === 429) {
      userMessage = 'Trop de requêtes, veuillez patienter quelques secondes';
    } else if (status === 403) {
      userMessage = 'Accès refusé - Vérifiez la clé API';
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'Délai d\'attente dépassé';
    } else if (error.code === 'ECONNREFUSED') {
      userMessage = 'Impossible de contacter le serveur API';
    }
    
    res.status(status).json({
      error: userMessage,
      code: status,
      details: process.env.NODE_ENV === 'development' ? message : undefined
    });
  }
});

// Health check avec statistiques
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    queueSize: rateLimiter.queue.length,
    cacheSize: cache.size,
    uptime: process.uptime()
  });
});

// Clear cache endpoint (pour développement)
if (process.env.NODE_ENV === 'development') {
  app.post('/clear-cache', (req, res) => {
    cache.clear();
    res.json({ message: 'Cache cleared', timestamp: new Date().toISOString() });
  });
}

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`🔑 API Key configured: ${API_KEY.substring(0, 10)}...`);
  console.log(`📦 Cache enabled: ${CACHE_DURATION / 1000}s duration`);
});