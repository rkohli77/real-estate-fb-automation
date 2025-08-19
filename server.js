// server.js - Clean main server file
const express = require('express');
const cors = require('cors');
const facebookRoutes = require('./routes/facebook');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    message: "🏠 Real Estate Sage API",
    status: "✅ Running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "GET /",
      postToFacebook: "POST /api/post-now",
      facebookStatus: "GET /api/facebook-status",
      pageInfo: "GET /api/page-info",
      privacyPolicy: "GET /api/privacy-policy"
    },
    version: "2.0.0"
  });
});

// Facebook API routes
app.use('/api', facebookRoutes);

// Privacy policy for Facebook app compliance
app.get('/api/privacy-policy', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Real Estate Sage</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 15px; }
    .highlight { background: #e8f4fd; padding: 20px; border-radius: 10px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>🛡️ Privacy Policy</h1>
  <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
  
  <div class="highlight">
    <strong>🔒 Your Privacy:</strong> We only use Facebook data to post content when you authorize it.
  </div>

  <h2>Facebook Integration</h2>
  <p>When you use our Real Estate Sage application:</p>
  <ul>
    <li>We only post content you explicitly approve</li>
    <li>We don't store your Facebook data</li>
    <li>You can revoke permissions anytime</li>
  </ul>

  <h2>Contact</h2>
  <p>📧 Email: privacy@real-estate-sage.com</p>
  <p>🌐 Website: https://real-estate-sage-theta.vercel.app</p>
</body>
</html>
  `);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: "🔍 Endpoint not found",
    requested: req.originalUrl,
    available: [
      "GET /",
      "POST /api/post-now",
      "GET /api/facebook-status", 
      "GET /api/page-info",
      "GET /api/privacy-policy"
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Unhandled error:', error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Real Estate Sage API running on port ${port}`);
  console.log(`🌐 Health check: http://localhost:${port}`);
  console.log(`📝 Post endpoint: http://localhost:${port}/api/post-now`);
  console.log(`📘 Facebook status: http://localhost:${port}/api/facebook-status`);
  console.log(`🛡️ Privacy policy: http://localhost:${port}/api/privacy-policy`);
});

module.exports = app;