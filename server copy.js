// Add at the top of server.js
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

// Add after express initialization
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080'],
  credentials: true
}));

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