// facebook-simple.js - Simple Facebook API wrapper using direct HTTP calls
const axios = require('axios');
require('dotenv').config();

class FacebookAPI {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pageId = process.env.FACEBOOK_PAGE_ID;
    this.appId = process.env.FACEBOOK_APP_ID;
    this.appSecret = process.env.FACEBOOK_APP_SECRET;
    this.baseURL = 'https://graph.facebook.com/v18.0';
  }

  async testConnection() {
    try {
      if (!this.accessToken || !this.pageId) {
        return {
          connected: false,
          error: 'Missing Facebook credentials (ACCESS_TOKEN or PAGE_ID)'
        };
      }

      const response = await axios.get(`${this.baseURL}/${this.pageId}`, {
        params: {
          fields: 'name,id',
          access_token: this.accessToken
        }
      });
      
      return {
        connected: true,
        page: {
          id: response.data.id,
          name: response.data.name
        }
      };
    } catch (error) {
      console.error('Facebook connection test failed:', error.response?.data || error.message);
      return {
        connected: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async getPageInfo() {
    try {
      if (!this.pageId || !this.accessToken) {
        throw new Error('Facebook Page ID or Access Token not configured');
      }

      const response = await axios.get(`${this.baseURL}/${this.pageId}`, {
        params: {
          fields: 'name,id,followers_count,fan_count',
          access_token: this.accessToken
        }
      });
      
      return {
        id: response.data.id,
        name: response.data.name,
        followers: response.data.followers_count || 0,
        likes: response.data.fan_count || 0
      };
    } catch (error) {
      console.error('Get page info failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }

  async postMessage(content) {
    try {
      if (!this.pageId || !this.accessToken) {
        return {
          success: false,
          error: 'Missing Facebook credentials'
        };
      }

      const response = await axios.post(`${this.baseURL}/${this.pageId}/feed`, {
        message: content,
        access_token: this.accessToken
      });

      return {
        success: true,
        postId: response.data.id,
        message: 'Posted successfully to Facebook'
      };
    } catch (error) {
      console.error('Facebook post failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async postWithImage(content, imageUrl) {
    try {
      if (!this.pageId || !this.accessToken) {
        return {
          success: false,
          error: 'Missing Facebook credentials'
        };
      }

      const response = await axios.post(`${this.baseURL}/${this.pageId}/photos`, {
        message: content,
        url: imageUrl,
        access_token: this.accessToken
      });

      return {
        success: true,
        postId: response.data.id,
        message: 'Posted with image successfully to Facebook'
      };
    } catch (error) {
      console.error('Facebook post with image failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
}

// Export singleton instance
const facebookAPI = new FacebookAPI();

module.exports = {
  facebookAPI
};