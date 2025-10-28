const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.use('/api', createProxyMiddleware({
  target: 'https://open-api.bser.io',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('x-api-key', process.env.BSER_API_KEY || 'LP52buVSrE5NraMONoHOD76rFbg81v');
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});