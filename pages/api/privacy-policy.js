export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Real Estate Sage</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
            background-color: #fafafa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            margin-top: 35px;
            margin-bottom: 15px;
        }
        .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            margin: 25px 0;
            border-radius: 10px;
            font-weight: 500;
        }
        .contact-info {
            background-color: #e8f4fd;
            padding: 25px;
            border-radius: 10px;
            margin-top: 30px;
            border-left: 5px solid #3498db;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        .back-link {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-bottom: 20px;
            transition: background 0.3s;
        }
        .back-link:hover {
            background: #2980b9;
        }
        .facebook-compliance {
            background: #f8f9fa;
            border: 2px solid #28a745;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
        }
        .date-updated {
            color: #666;
            font-style: italic;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to Real Estate Sage</a>
        
        <h1>🛡️ Privacy Policy</h1>
        <p class="date-updated"><strong>Last updated:</strong> ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        
        <div class="highlight">
            <strong>🔒 Your Privacy Matters:</strong> We only use your Facebook data to post content when you authorize it. 
            We don't sell your information, share it unnecessarily, or store it longer than needed.
        </div>

        <h2>1. 📊 Information We Collect</h2>
        <p>When you use Real Estate Sage and connect it with Facebook, we may collect:</p>
        <ul>
            <li><strong>Profile Information:</strong> Name, email address, profile picture</li>
            <li><strong>Facebook Pages:</strong> Pages you manage (if applicable)</li>
            <li><strong>Content Data:</strong> Posts you create and schedule through our app</li>
            <li><strong>Usage Analytics:</strong> How you use our features (anonymized)</li>
        </ul>

        <h2>2. 🎯 How We Use Your Information</h2>
        <p>We use your information exclusively to:</p>
        <ul>
            <li><strong>Provide Service:</strong> Enable real estate social media posting</li>
            <li><strong>Facebook Integration:</strong> Post content when you authorize it</li>
            <li><strong>Improve Experience:</strong> Enhance app functionality and usability</li>
            <li><strong>Support:</strong> Help you with technical issues</li>
            <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
        </ul>

        <h2>3. 🤝 Information Sharing</h2>
        <p><strong>We DO NOT sell your data.</strong> We only share information:</p>
        <ul>
            <li><strong>With Facebook:</strong> When you authorize posts (required for service)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
            <li><strong>Service Providers:</strong> Trusted partners under strict confidentiality (hosting, analytics)</li>
        </ul>

        <h2>4. 🔐 Data Security</h2>
        <p>We protect your information with:</p>
        <ul>
            <li><strong>Encryption:</strong> All data transmitted using HTTPS/TLS</li>
            <li><strong>Secure Hosting:</strong> Industry-standard cloud infrastructure</li>
            <li><strong>Access Controls:</strong> Limited employee access on need-to-know basis</li>
            <li><strong>Regular Audits:</strong> Security reviews and updates</li>
            <li><strong>Token Security:</strong> Facebook access tokens encrypted at rest</li>
        </ul>

        <div class="facebook-compliance">
            <h2>📘 Facebook Integration Details</h2>
            <p><strong>Permissions We Request:</strong></p>
            <ul>
                <li><code>pages_manage_posts</code> - To post on your Facebook pages</li>
                <li><code>pages_read_engagement</code> - To read post performance</li>
                <li><code>email</code> - For account creation and communication</li>
            </ul>
            <p><strong>Your Control:</strong></p>
            <ul>
                <li>Revoke permissions anytime in your Facebook Settings → Apps</li>
                <li>We only post content you explicitly approve</li>
                <li>No access to private messages, personal posts, or friends list</li>
            </ul>
        </div>

        <h2>6. 📅 Data Retention</h2>
        <ul>
            <li><strong>Account Data:</strong> Until you delete your account</li>
            <li><strong>Posted Content Logs:</strong> 90 days (for troubleshooting)</li>
            <li><strong>Facebook Access Tokens:</strong> Refreshed automatically, expired ones deleted immediately</li>
            <li><strong>Analytics Data:</strong> Anonymized, kept for service improvement</li>
        </ul>

        <h2>7. 👤 Your Rights</h2>
        <p>You can:</p>
        <ul>
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Correct:</strong> Update inaccurate information</li>
            <li><strong>Delete:</strong> Request account and data deletion</li>
            <li><strong>Export:</strong> Download your data in portable format</li>
            <li><strong>Withdraw Consent:</strong> Disconnect Facebook integration anytime</li>
        </ul>

        <h2>8. 🍪 Cookies & Tracking</h2>
        <p>We use cookies for:</p>
        <ul>
            <li>Keeping you logged in</li>
            <li>Remembering your preferences</li>
            <li>Basic analytics (page views, feature usage)</li>
            <li>Security (preventing unauthorized access)</li>
        </ul>

        <h2>9. 📝 Policy Changes</h2>
        <p>We'll notify you of changes via:</p>
        <ul>
            <li>Email notification (for significant changes)</li>
            <li>In-app notification</li>
            <li>Updated date on this page</li>
        </ul>

        <div class="contact-info">
            <h2>📞 Contact Us</h2>
            <p><strong>Questions about this Privacy Policy?</strong></p>
            <p>
                <strong>📧 Email:</strong> privacy@real-estate-sage.com<br>
                <strong>🌐 Website:</strong> https://real-estate-sage-theta.vercel.app<br>
                <strong>⏰ Response Time:</strong> Within 48 hours<br>
                <strong>📍 Data Controller:</strong> Real Estate Sage Team
            </p>
        </div>

        <div class="facebook-compliance">
            <h3>✅ Facebook Platform Compliance</h3>
            <p>
                This application fully complies with Facebook's Platform Policy and Data Policy. 
                We follow all current guidelines for data handling, user consent, and API usage. 
                Our Facebook integration is regularly reviewed for compliance updates.
            </p>
        </div>
    </div>
</body>
</html>
  `);
}