
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/v1',
        createProxyMiddleware({
            target: 'https://wade-api-uat.azure-api.net',
            changeOrigin: true,
            onProxyRes: function (proxyRes, req, res) {
                // Add CORS headers to the proxied response
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Credentials', true);
              },
        })
    );
};