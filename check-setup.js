const fs = require('fs');
require('dotenv').config();

console.log('🔍 Development Environment Check');
console.log('================================');

const checks = [
    {
        name: 'Environment file',
        test: () => fs.existsSync('.env'),
        required: true
    },
    {
        name: 'Server file',
        test: () => fs.existsSync('server.js'),
        required: true,
        note: 'Copy from the provided artifact'
    },
    {
        name: 'Facebook App ID',
        test: () => process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_ID !== 'your_facebook_app_id_here',
        required: false,
        note: 'Required for Facebook posting'
    },
    {
        name: 'Facebook Page ID',
        test: () => process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ID !== 'your_facebook_page_id_here',
        required: false,
        note: 'Required for Facebook posting'
    },
    {
        name: 'Facebook Access Token',
        test: () => process.env.FACEBOOK_ACCESS_TOKEN && process.env.FACEBOOK_ACCESS_TOKEN !== 'your_facebook_access_token_here',
        required: false,
        note: 'Required for Facebook posting'
    },
    {
        name: 'OpenAI API Key',
        test: () => process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here',
        required: true,
        note: 'Required for content generation'
    },
    {
        name: 'Node modules',
        test: () => fs.existsSync('node_modules'),
        required: true,
        note: 'Run npm install'
    }
];

let allRequired = true;
let warnings = 0;

checks.forEach(check => {
    const passed = check.test();
    const status = passed ? '✅' : (check.required ? '❌' : '⚠️');
    const message = check.note ? ` (${check.note})` : '';
    
    console.log(`${status} ${check.name}${message}`);
    
    if (!passed && check.required) {
        allRequired = false;
    } else if (!passed) {
        warnings++;
    }
});

console.log('\nSummary:');
if (allRequired) {
    console.log('✅ All required checks passed!');
    if (warnings > 0) {
        console.log(`⚠️  ${warnings} optional warning(s) - some features may not work`);
    }
    console.log('\n🚀 You can start the server with: npm run dev');
    console.log('🧪 Run Facebook debug with: npm run debug:facebook');
} else {
    console.log('❌ Some required checks failed. Please fix the issues above.');
    console.log('\nNext steps:');
    console.log('1. Copy server.js from the provided code artifacts');
    console.log('2. Update .env file with your API keys');
    console.log('3. Run: npm install');
}
