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

// NEW: POST /api/post-listing - Post a single property listing
router.post('/post-listing', async (req, res) => {
  try {
    const listingData = req.body;
    
    console.log('🏠 Property listing request received:', { 
      address: listingData.address, 
      price: listingData.price,
      city: listingData.city,
      timestamp: new Date().toISOString(),
      ip: req.ip
    });
    
    // Validate required fields
    if (!listingData.address || !listingData.price || !listingData.city) {
      return res.status(400).json({ 
        error: "Missing required fields: address, price, and city are required",
        received: {
          address: !!listingData.address,
          price: !!listingData.price,
          city: !!listingData.city,
          bedrooms: listingData.bedrooms,
          bathrooms: listingData.bathrooms
        },
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

    // Validate data types and ranges
    if (listingData.bedrooms && (listingData.bedrooms < 0 || listingData.bedrooms > 20)) {
      return res.status(400).json({
        error: "Bedrooms must be between 0 and 20",
        received: listingData.bedrooms
      });
    }

    if (listingData.bathrooms && (listingData.bathrooms < 0 || listingData.bathrooms > 20)) {
      return res.status(400).json({
        error: "Bathrooms must be between 0 and 20",
        received: listingData.bathrooms
      });
    }

    if (listingData.sqft && (listingData.sqft < 0 || listingData.sqft > 50000)) {
      return res.status(400).json({
        error: "Square footage must be between 0 and 50,000",
        received: listingData.sqft
      });
    }

    // Create property listing object
    const propertyListing = facebookAPI.createPropertyListing(listingData);

    // Post to Facebook
    const result = await facebookAPI.postPropertyListing(propertyListing);
    
    if (result.success) {
      const response = {
        message: "🎉 Property listing posted successfully to Facebook!",
        success: true,
        listing: {
          id: propertyListing.id,
          address: propertyListing.address,
          price: propertyListing.price,
          city: propertyListing.city,
          type: propertyListing.type,
          bedrooms: propertyListing.bedrooms,
          bathrooms: propertyListing.bathrooms
        },
        facebook: result,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Property listing posted successfully:', response);
      res.status(200).json(response);
    } else {
      const errorResponse = {
        error: "❌ Failed to post property listing to Facebook",
        success: false,
        details: result.error,
        listing: {
          address: propertyListing.address,
          price: propertyListing.price,
          city: propertyListing.city
        },
        timestamp: new Date().toISOString(),
        help: "Check Facebook API credentials and permissions"
      };
      
      console.log('❌ Property listing post failed:', errorResponse);
      res.status(500).json(errorResponse);
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
router.post('/post-multiple-listings', async (req, res) => {
  try {
    const { listings, delayBetweenPosts = 5000 } = req.body;
    
    console.log('🏠 Multiple listings request received:', { 
      count: listings?.length, 
      delay: delayBetweenPosts,
      timestamp: new Date().toISOString(),
      ip: req.ip
    });
    
    // Validate listings array
    if (!listings || !Array.isArray(listings) || listings.length === 0) {
      return res.status(400).json({ 
        error: "Listings array is required and must contain at least one listing",
        received: {
          listings: listings ? (Array.isArray(listings) ? listings.length : typeof listings) : 'missing',
          delayBetweenPosts: delayBetweenPosts
        },
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

    // Validate delay parameter
    if (delayBetweenPosts < 1000 || delayBetweenPosts > 60000) {
      return res.status(400).json({
        error: "Delay between posts must be between 1000ms (1s) and 60000ms (60s)",
        received: delayBetweenPosts,
        recommended: 5000
      });
    }

    // Limit batch size to prevent abuse
    if (listings.length > 50) {
      return res.status(400).json({
        error: "Maximum 50 listings per batch",
        received: listings.length,
        maxAllowed: 50
      });
    }

    // Validate each listing has required fields
    const invalidListings = listings.map((listing, index) => {
      const errors = [];
      if (!listing.address) errors.push('address');
      if (!listing.price) errors.push('price');
      if (!listing.city) errors.push('city');
      return errors.length > 0 ? { index, errors, address: listing.address || 'N/A' } : null;
    }).filter(item => item !== null);

    if (invalidListings.length > 0) {
      return res.status(400).json({
        error: "Some listings are missing required fields (address, price, city)",
        invalidListings: invalidListings,
        invalidCount: invalidListings.length,
        totalCount: listings.length
      });
    }

    console.log(`📤 Starting to post ${listings.length} listings with ${delayBetweenPosts/1000}s delay...`);

    // Post multiple listings
    const results = await facebookAPI.postMultipleListings(listings, delayBetweenPosts);
    
    const successCount = results.filter(r => r.result.success).length;
    const failCount = results.length - successCount;

    const response = {
      message: `📊 Batch posting complete: ${successCount} posted, ${failCount} failed`,
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failCount,
        successRate: `${((successCount / results.length) * 100).toFixed(1)}%`
      },
      results: results.map((r, index) => ({
        index: index + 1,
        address: r.listing.address,
        price: r.listing.price,
        city: r.listing.city,
        success: r.result.success,
        error: r.result.error || null,
        postId: r.result.postId || null
      })),
      settings: {
        delayBetweenPosts: delayBetweenPosts,
        totalProcessingTime: `${((results.length - 1) * delayBetweenPosts / 1000).toFixed(1)}s`
      },
      timestamp: new Date().toISOString()
    };

    console.log(`📊 Batch posting complete: ${successCount} success, ${failCount} failed`);
    res.status(200).json(response);

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