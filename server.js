// Add at the top of server.js
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express'); // ← Add this
const axios = require('axios'); // ← You'll need this for the Facebook API call

// Create the Express app instance
const app = express(); // ← Add this line
app.use(express.json());
// Now you can use app.use()
// app.use(helmet());

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080'],
  credentials: true
}));

// app.use(helmet({
//   contentSecurityPolicy: false // Disable CSP completely for testing
// }));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Add this test endpoint to server.js for getting page tokens
app.get('/auth/facebook/pages', async (req, res) => {
  try {
    // This is a helper endpoint for development
    // In production, implement proper OAuth flow
    const userToken = req.query.user_access_token;
    
    const response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
      params: {
        access_token: userToken
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this at the top of your server.js
// const ContentGenerator = {
//   generateListingPost: async (data) => {
//     return {
//       title: `Property Listing: ${data.property || 'Unknown Property'}`,
//       description: `Amazing property priced at $${data.price || 'TBD'}`,
//       hashtags: ['#realestate', '#property', '#forsale'],
//       generatedAt: new Date().toISOString()
//     };
//   }
// };
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
// app.post ('/api/listings', async (req, res) => {
// try {
// const content = await ContentGenerator.generateListingPost(req.body);
// res.json({ success: true, content });
// } catch (error) {
// res.status (500).json({ error: error.message });
// }
// });
app.post('/api/listings', async (req, res) => {
  try {
    // Simple test response instead of ContentGenerator
    const content = {
      title: "Test Property",
      description: "This is a test listing",
      data: req.body // Echo back what was sent
    };
    
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/test', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            button { padding: 10px 20px; font-size: 16px; }
            #result { margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
            pre { white-space: pre-wrap; }
            .success { border-left: 4px solid green; }
            .error { border-left: 4px solid red; }
        </style>
    </head>
    <body>
        <h1>Real Estate API Test</h1>
        <button id="testBtn">Test Generate Content</button>
        <div id="result"></div>
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('testBtn').addEventListener('click', async function() {
                    const resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = 'Testing...';
                    
                    try {
                        const response = await fetch('/api/test/generate-content', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                address: "123 Test Street",
                                price: "$450,000",
                                bedrooms: 3,
                                bathrooms: 2,
                                sqft: 1800,
                                features: ["hardwood floors", "updated kitchen"]
                            })
                        });
                        
                        const data = await response.json();
                        resultDiv.className = 'success';
                        resultDiv.innerHTML = '<h3>✅ Success:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } catch (error) {
                        resultDiv.className = 'error';
                        resultDiv.innerHTML = '<h3>❌ Error:</h3><pre>' + error.message + '</pre>';
                    }
                });
            });
        </script>
    </body>
    </html>
    `);
});