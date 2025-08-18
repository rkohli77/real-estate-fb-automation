const axios = require('axios');

class FacebookAPI {
  static async postToPage(message, imageUrl = null, scheduledTime = null) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log('DEV MODE - Would post:', { message, imageUrl, scheduledTime });
      return { success: true, postId: 'dev_' + Date.now() };
    }
    
    try {
      const pageAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
      const pageId = process.env.FACEBOOK_PAGE_ID;
      
      if (!pageAccessToken || !pageId) {
        throw new Error('Missing Facebook credentials');
      }
      
      let postData = {
        message: message,
        access_token: pageAccessToken
      };
      
      // Add image if provided
      if (imageUrl) {
        postData.link = imageUrl;
      }
      
      // Add scheduling if provided
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