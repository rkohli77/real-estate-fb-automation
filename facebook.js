// facebook.js - Facebook API wrapper
const { FacebookAdsApi, Page } = require('facebook-nodejs-business-sdk');
require('dotenv').config();

class FacebookAPI {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pageId = process.env.FACEBOOK_PAGE_ID;
    this.appId = process.env.FACEBOOK_APP_ID;
    this.appSecret = process.env.FACEBOOK_APP_SECRET;
    
    // Initialize Facebook API
    if (this.accessToken && this.appId && this.appSecret) {
      FacebookAdsApi.init(this.accessToken);
    }
  }

  async testConnection() {
    try {
      if (!this.accessToken || !this.pageId) {
        return {
          connected: false,
          error: 'Missing Facebook credentials (ACCESS_TOKEN or PAGE_ID)'
        };
      }

      const page = new Page(this.pageId);
      const pageInfo = await page.read(['name', 'id']);
      
      return {
        connected: true,
        page: {
          id: pageInfo.id,
          name: pageInfo.name
        }
      };
    } catch (error) {
      console.error('Facebook connection test failed:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }

  async getPageInfo() {
    try {
      if (!this.pageId) {
        throw new Error('Facebook Page ID not configured');
      }

      const page = new Page(this.pageId);
      const pageInfo = await page.read(['name', 'id', 'followers_count', 'fan_count']);
      
      return {
        id: pageInfo.id,
        name: pageInfo.name,
        followers: pageInfo.followers_count,
        likes: pageInfo.fan_count
      };
    } catch (error) {
      console.error('Get page info failed:', error);
      throw error;
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

      const page = new Page(this.pageId);
      
      // Post to Facebook page feed
      const response = await page.createFeed(
        ['id'],
        {
          message: content,
          access_token: this.accessToken
        }
      );

      return {
        success: true,
        postId: response.id,
        message: 'Posted successfully to Facebook'
      };
    } catch (error) {
      console.error('Facebook post failed:', error);
      return {
        success: false,
        error: error.message
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

      const page = new Page(this.pageId);
      
      // Post with image to Facebook page
      const response = await page.createPhoto(
        ['id'],
        {
          message: content,
          url: imageUrl,
          access_token: this.accessToken
        }
      );

      return {
        success: true,
        postId: response.id,
        message: 'Posted with image successfully to Facebook'
      };
    } catch (error) {
      console.error('Facebook post with image failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const facebookAPI = new FacebookAPI();

module.exports = {
  facebookAPI
};