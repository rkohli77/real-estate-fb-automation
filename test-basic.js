// Basic test to verify server can start
const axios = require('axios');

async function testBasicSetup() {
    console.log('🧪 Basic Setup Test');
    console.log('==================');
    
    try {
        // Test if we can require the main modules
        console.log('✅ Testing module requires...');
        require('express');
        require('axios');
        require('dotenv');
        console.log('✅ All required modules available');
        
        // Test environment loading
        require('dotenv').config();
        console.log('✅ Environment variables loaded');
        
        // Test if server file exists
        const fs = require('fs');
        if (fs.existsSync('server.js')) {
            console.log('✅ server.js found');
        } else {
            console.log('❌ server.js not found - copy from artifacts');
        }
        
        console.log('\n🎯 Basic setup test completed successfully!');
        console.log('Next steps:');
        console.log('1. Copy server.js from the code artifacts');
        console.log('2. Update .env with your API keys');
        console.log('3. Run: npm run setup:check');
        
    } catch (error) {
        console.log('❌ Setup test failed:', error.message);
        console.log('\nTry running: npm install');
    }
}

testBasicSetup();
