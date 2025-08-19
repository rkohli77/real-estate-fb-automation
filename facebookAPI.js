// facebook.js - Facebook API integration module

class FacebookAPI {
  constructor(pageId, accessToken) {
    this.pageId = pageId;
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com';
  }

  // Post a message to Facebook page
  async postMessage(message) {
    try {
      console.log('🔄 Posting to Facebook:', { pageId: this.pageId, message });
      
      const response = await fetch(`${this.baseUrl}/${this.pageId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          access_token: this.accessToken
        })
      });

      const data = await response.json();
      console.log('📘 Facebook API response:', data);
      
      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message} (Code: ${data.error.code})`);
      }
      
      return {
        success: true,
        postId: data.id,
        facebookUrl: `https://www.facebook.com/${this.pageId}/posts/${data.id.split('_')[1]}`,
        pageUrl: `https://www.facebook.com/${this.pageId}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Facebook posting error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Test Facebook connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.pageId}?fields=name,category,fan_count&access_token=${this.accessToken}`);
      const data = await response.json();
      
      if (data.error) {
        return {
          connected: false,
          error: data.error.message
        };
      }
      
      return {
        connected: true,
        page: {
          id: this.pageId,
          name: data.name,
          category: data.category,
          fanCount: data.fan_count || 'N/A',
          url: `https://www.facebook.com/${this.pageId}`
        }
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Get page information
  async getPageInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.pageId}?fields=name,category,about,website,phone,fan_count&access_token=${this.accessToken}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Failed to get page info: ${error.message}`);
    }
  }

  // Post with image (for future use)
  async postWithImage(message, imageUrl) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.pageId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          url: imageUrl,
          access_token: this.accessToken
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`);
      }
      
      return {
        success: true,
        postId: data.id,
        imageId: data.post_id,
        facebookUrl: `https://www.facebook.com/${this.pageId}/posts/${data.post_id}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Configuration
const FACEBOOK_CONFIG = {
  PAGE_ID: "711339472071578", // Your "Real-estates" page
  ACCESS_TOKEN: "EAAeumaro3gYBPLnkj4d0qpvstUpl59ZC559mCOFPo5UM9ZAc6wmhTXCyhLYxdAn8sGieTiqoT0hrdk9RSxtXz4NVDmbWAE1ZCyX7x1LqgIAzHJgt6PQQwyxPWA6Sdh0crUoZBEZAM307AysCtUM7DlSQZARBc1vQfH4RfCGdg0udMu2hEPo42nb1mAfYVYmUltj35zwYm7VhH3eM6l2dykDFfDsHDNnLzVDXaxidA0"
};

// Create Facebook API instance
const facebookAPI = new FacebookAPI(FACEBOOK_CONFIG.PAGE_ID, FACEBOOK_CONFIG.ACCESS_TOKEN);

// Export both the class and the instance
module.exports = {
  FacebookAPI,
  facebookAPI,
  FACEBOOK_CONFIG
};