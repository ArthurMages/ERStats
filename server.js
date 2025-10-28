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

// Rate limiting amélioré avec queue
class RateLimiter {
  constructor(requestsPerSecond = 1) {
    this.queue = [];
    this.processing = false;
    this.interval = 1000 / requestsPerSecond;
    this.lastRequestTime = 0;
  }

  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
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
      
      const { fn, resolve, reject } = this.queue.shift();
      this.lastRequestTime = Date.now();
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter(0.8); // 0.8 requêtes/seconde pour être safe

app.use('/api', async (req, res) => {
  try {
    const path = req.path;
    const queryString = req.url.split('?')[1] || '';
    const url = `${BSER_API}${path}${queryString ? '?' + queryString : ''}`;
    
    console.log('📡 Proxying request to:', url);
    
    const response = await rateLimiter.execute(async () => {
      return await axios.get(url, {
        headers: {
          'x-api-key': API_KEY
        },
        timeout: 10000 // 10 secondes timeout
      });
    });
    
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    
    console.error('❌ Proxy error:', {
      status,
      message,
      url: req.url
    });
    
    // Messages d'erreur utilisateur-friendly
    let userMessage = 'Erreur serveur';
    
    if (status === 404) {
      userMessage = 'Données non trouvées';
    } else if (status === 429) {
      userMessage = 'Trop de requêtes, veuillez patienter';
    } else if (status === 403) {
      userMessage = 'Accès refusé - Vérifiez la clé API';
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'Délai d\'attente dépassé';
    }
    
    res.status(status).json({
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    queueSize: rateLimiter.queue.length
  });
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`🔑 API Key configured: ${API_KEY.substring(0, 10)}...`);
});