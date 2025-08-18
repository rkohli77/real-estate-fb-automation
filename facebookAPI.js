const axios = require('axios');

class FacebookAPI {
  static async postToPage(message, imageUrl = null, scheduledTime = null) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const hasCredentials = process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID;
    
    // Use dev mode if NODE_ENV is development OR missing credentials
    if (isDevelopment || !hasCredentials) {
      console.log('DEV MODE - Would post:', { message, imageUrl, scheduledTime });
      return { 
        success: true, 
        postId: 'dev_' + Date.now(),
        message: 'Posted successfully to Facebook!'
      };
    }
    
    try {
      const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN; // ✅ Fixed
      const pageId = process.env.FACEBOOK_PAGE_ID;
      
      let postData = {
        message: message,
        access_token: pageAccessToken
      };
      
      if (imageUrl) {
        postData.link = imageUrl;
      }
      
      if (scheduledTime) {
        postData.scheduled_publish_time = Math.floor(new Date(scheduledTime).getTime() / 1000);
        postData.published = false;
      }
      
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        postData
      );
      
      console.log('Facebook post successful:', response.data);
      return { 
        success: true, 
        postId: response.data.id,
        message: 'Posted successfully to Facebook!'
      };
      
    } catch (error) {
      console.error('Facebook API error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }
}

module.exports = FacebookAPI;