// routes/facebook.js - Facebook route handlers
const express = require('express');
const router = express.Router();
const { facebookAPI } = require('../facebook');

// POST /api/post-now - Enhanced with Facebook posting
router.post('/post-now', async (req, res) => {
  try {
    const { content } = req.body;
    
    console.log('📝 Post request received:', { 
      content, 
      timestamp: new Date().toISOString(),
      ip: req.ip 
    });
    
    // Validate input
    if (!content) {
      return res.status(400).json({ 
        error: "Content is required",
        received: req.body,
        example: { 
          content: "Your real estate post content here 🏠" 
        }
      });
    }

    if (content.length > 8000) {
      return res.status(400).json({
        error: "Content too long (max 8000 characters)",
        length: content.length,
        maxLength: 8000
      });
    }

    // Post to Facebook
    const result = await facebookAPI.postMessage(content);
    
    if (result.success) {
      const response = {
        message: "🎉 Posted successfully to Facebook!",
        success: true,
        facebook: result,
        content: content,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Success:', response);
      res.status(200).json(response);
    } else {
      const errorResponse = {
        error: "❌ Failed to post to Facebook",
        success: false,
        details: result.error,
        content: content,
        timestamp: new Date().toISOString(),
        help: "Check Facebook API credentials and permissions"
      };
      
      console.log('❌ Error:', errorResponse);
      res.status(500).json(errorResponse);
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
router.get('/facebook-status', async (req, res) => {
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
router.get('/page-info', async (req, res) => {
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

// POST /api/post-with-image - Post with image (future feature)
router.post('/post-with-image', async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    
    if (!content || !imageUrl) {
      return res.status(400).json({
        error: "Both content and imageUrl are required",
        received: { content: !!content, imageUrl: !!imageUrl }
      });
    }

    const result = await facebookAPI.postWithImage(content, imageUrl);
    
    if (result.success) {
      res.status(200).json({
        message: "🎉 Posted with image successfully!",
        success: true,
        facebook: result,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: "❌ Failed to post with image",
        success: false,
        details: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Post with image error:', error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;