const express = require('express');
const cors = require('cors');
const { facebookAPI } = require('./facebook');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

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
      pageInfo: "GET /api/page-info"
    },
    version: "2.0.0"
  });
});

// POST /api/post-now - Post to Facebook
app.post('/api/post-now', async (req, res) => {
  try {
    const { content } = req.body;
    
    console.log('📝 Post request received:', { content, timestamp: new Date().toISOString() });
    
    if (!content) {
      return res.status(400).json({ 
        error: "Content is required",
        example: { content: "Your real estate post content here 🏠" }
      });
    }

    // Post to Facebook
    const result = await facebookAPI.postMessage(content);
    
    if (result.success) {
      console.log('✅ Success:', result);
      res.status(200).json({
        message: "🎉 Posted successfully to Facebook!",
        success: true,
        facebook: result,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Error:', result);
      res.status(500).json({
        error: "❌ Failed to post to Facebook",
        success: false,
        details: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('💥 Server error in post-now:', error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/facebook-status - Check Facebook connection
app.get('/api/facebook-status', async (req, res) => {
  try {
    const connectionTest = await facebookAPI.testConnection();
    
    if (connectionTest.connected) {
      res.status(200).json({
        status: "✅ Facebook connection OK",
        connected: true,
        page: connectionTest.page,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        status: "❌ Facebook connection failed",
        connected: false,
        error: connectionTest.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Facebook status check error:', error);
    res.status(500).json({
      status: "❌ Facebook test failed",
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/page-info - Get Facebook page information
app.get('/api/page-info', async (req, res) => {
  try {
    const pageInfo = await facebookAPI.getPageInfo();
    res.status(200).json({
      success: true,
      page: pageInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Page info error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Simple privacy policy
app.get('/api/privacy-policy', (req, res) => {
  res.send('<h1>Privacy Policy</h1><p>Real Estate Sage - We only use Facebook data when you authorize it.</p>');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Real Estate Sage API running on port ${port}`);
  console.log(`🌐 Health check: http://localhost:${port}`);
  console.log(`📝 Post endpoint: http://localhost:${port}/api/post-now`);
  console.log(`📘 Facebook status: http://localhost:${port}/api/facebook-status`);
});

module.exports = app;