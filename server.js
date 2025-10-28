const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = 'LP52buVSrE5NraMONoHOD3EltFlZo6D76rFbg81v';
const BSER_API = 'https://open-api.bser.io';

// Rate limiting
let lastRequestTime = 0;
const MIN_INTERVAL = 1000; // 1 seconde

app.use('/api', async (req, res) => {
  // Attendre si nécessaire
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  try {
    const path = req.path;
    const queryString = req.url.split('?')[1] || '';
    const url = `${BSER_API}${path}${queryString ? '?' + queryString : ''}`;
    
    console.log('Proxying request to:', url);
    
    const response = await axios.get(url, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});