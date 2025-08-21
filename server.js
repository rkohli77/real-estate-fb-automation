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
      pageInfo: "GET /api/page-info",
      postListing: "POST /api/post-listing",
      postMultipleListings: "POST /api/post-multiple-listings"
    },
    version: "2.1.0"
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

// In your server.js file, replace the post-listing route with this version:

// POST /api/post-listing - Post a single property listing (FIXED VERSION)
app.post('/api/post-listing', async (req, res) => {
  try {
    const listingData = req.body;
    
    console.log('🏠 Property listing request received:', { 
      address: listingData.address, 
      price: listingData.price,
      timestamp: new Date().toISOString() 
    });
    
    // Validate required fields
    if (!listingData.address || !listingData.price || !listingData.city) {
      return res.status(400).json({ 
        error: "Missing required fields: address, price, and city are required",
        example: {
          address: "123 Main Street",
          price: "450000",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1800,
          features: ["Hardwood floors", "Updated kitchen"],
          type: "House",
          neighborhood: "Downtown",
          city: "Springfield",
          imageUrl: "https://example.com/house.jpg"
        }
      });
    }

    // Create property listing object directly (without using createPropertyListing helper)
    const propertyListing = {
      id: Date.now() + Math.random(), // Simple ID generation
      address: listingData.address,
      price: listingData.price,
      bedrooms: listingData.bedrooms || 0,
      bathrooms: listingData.bathrooms || 0,
      sqft: listingData.sqft || null,
      features: listingData.features || [],
      type: listingData.type || "Property",
      neighborhood: listingData.neighborhood || null,
      city: listingData.city,
      imageUrl: listingData.imageUrl || null
    };

    // Post to Facebook using the existing postPropertyListing function
    const result = await facebookAPI.postPropertyListing(propertyListing);
    
    if (result.success) {
      console.log('✅ Property listing posted successfully:', result);
      res.status(200).json({
        message: "🎉 Property listing posted successfully to Facebook!",
        success: true,
        listing: {
          id: propertyListing.id,
          address: propertyListing.address,
          price: propertyListing.price,
          city: propertyListing.city
        },
        facebook: result,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Property listing post failed:', result);
      res.status(500).json({
        error: "❌ Failed to post property listing to Facebook",
        success: false,
        details: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('💥 Server error in post-listing:', error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// NEW: POST /api/post-multiple-listings - Post multiple property listings
app.post('/api/post-multiple-listings', async (req, res) => {
  try {
    const { listings, delayBetweenPosts = 5000 } = req.body;
    
    console.log('🏠 Multiple listings request received:', { 
      count: listings?.length, 
      delay: delayBetweenPosts,
      timestamp: new Date().toISOString() 
    });
    
    if (!listings || !Array.isArray(listings) || listings.length === 0) {
      return res.status(400).json({ 
        error: "Listings array is required and must contain at least one listing",
        example: {
          listings: [
            {
              address: "123 Main Street",
              price: "450000",
              bedrooms: 3,
              bathrooms: 2,
              city: "Springfield",
              type: "House"
            }
          ],
          delayBetweenPosts: 5000
        }
      });
    }

    // Validate each listing has required fields
    const invalidListings = listings.filter((listing, index) => 
      !listing.address || !listing.price || !listing.city
    );

    if (invalidListings.length > 0) {
      return res.status(400).json({
        error: "Some listings are missing required fields (address, price, city)",
        invalidCount: invalidListings.length,
        totalCount: listings.length
      });
    }

    console.log(`📤 Starting to post ${listings.length} listings with ${delayBetweenPosts/1000}s delay...`);

    // Post multiple listings
    const results = await facebookAPI.postMultipleListings(listings, delayBetweenPosts);
    
    const successCount = results.filter(r => r.result.success).length;
    const failCount = results.length - successCount;

    console.log(`📊 Batch posting complete: ${successCount} success, ${failCount} failed`);

    res.status(200).json({
      message: `📊 Batch posting complete: ${successCount} posted, ${failCount} failed`,
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failCount
      },
      results: results.map(r => ({
        address: r.listing.address,
        price: r.listing.price,
        success: r.result.success,
        error: r.result.error || null,
        postId: r.result.postId || null
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Server error in post-multiple-listings:', error);
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
  console.log(`🌍 Health check: http://localhost:${port}`);
  console.log(`📝 Post endpoint: http://localhost:${port}/api/post-now`);
  console.log(`🏠 Post listing: http://localhost:${port}/api/post-listing`);
  console.log(`🏠 Post multiple: http://localhost:${port}/api/post-multiple-listings`);
  console.log(`📘 Facebook status: http://localhost:${port}/api/facebook-status`);
});

module.exports = app;