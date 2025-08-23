const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files (your existing HTML/CSS/JS)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Zoho API integration functions
async function getZohoAccessToken() {
  const clientId = process.env.ZOHO_CAMPAIGNS_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CAMPAIGNS_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho OAuth credentials not configured');
  }

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token'
  });

  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(`Failed to refresh token: ${data.error || response.status}`);
  }

  return data.access_token;
}

async function subscribeToZohoCampaigns(email, source) {
  const listKey = process.env.ZOHO_CAMPAIGNS_LIST_KEY;

  if (!listKey) {
    throw new Error('Zoho Campaigns list key not configured');
  }

  // Get fresh access token
  const accessToken = await getZohoAccessToken();

  console.log('Zoho API request for email:', email);
  console.log('Access token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NO TOKEN');
  
  // Use bulk add API which doesn't require confirmation
  const bulkParams = new URLSearchParams({
    resfmt: 'JSON',
    listkey: listKey,
    emailids: email
  });
  
  const response = await fetch('https://campaigns.zoho.com/api/v1.1/addlistsubscribersinbulk', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bulkParams.toString()
  });

  const responseText = await response.text();
  console.log('Zoho API raw response:', responseText);
  
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('Failed to parse Zoho response as JSON');
    throw new Error('Invalid response from Zoho API');
  }
  
  if (!response.ok) {
    throw new Error(`Zoho API error: ${response.status} - ${JSON.stringify(data)}`);
  }
  
  // Check for Zoho-specific error responses
  if (data.code && data.code !== '0') {
    throw new Error(`Zoho API error: ${data.message || data.code}`);
  }
  
  return data;
}

// API endpoint for email capture
app.post('/api/email-capture', async (req, res) => {
  try {
    const { email, source } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      });
    }

    // Set default source if not provided
    const emailSource = source || 'career-launch-landing';

    try {
      // Subscribe to Zoho Campaigns (with automatic token refresh)
      await subscribeToZohoCampaigns(email, emailSource);
      
      console.log('Email subscribed to Zoho Campaigns:', { 
        email, 
        source: emailSource, 
        timestamp: new Date().toISOString() 
      });

      return res.status(200).json({
        message: 'Thank you! We\'ll notify you as soon as the agenda is available.',
        email,
        source: emailSource
      });
    } catch (zohoError) {
      console.error('Zoho Campaigns error:', zohoError.message || zohoError);
      console.error('Full error:', zohoError);
      
      // Fallback: still log the email capture even if Zoho fails
      console.log('Email captured (Zoho failed):', { 
        email, 
        source: emailSource, 
        timestamp: new Date().toISOString() 
      });
      
      return res.status(200).json({
        message: 'Thank you for your interest! We\'ll be in touch soon.',
        email,
        source: emailSource
      });
    }
  } catch (error) {
    console.error('Error in email capture:', error);
    return res.status(500).json({
      message: 'An error occurred. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Email capture endpoint: http://localhost:${PORT}/api/email-capture`);
});