const https = require('https');
const querystring = require('querystring');

// Function to get Strava access token
async function getStravaAccessToken() {
  const postData = querystring.stringify({
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  });

  const options = {
    hostname: 'www.strava.com',
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const parsedData = JSON.parse(data);
        if (parsedData.errors) {
          reject(new Error(`Error fetching access token: ${parsedData.message}`));
        } else {
          resolve(parsedData.access_token);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { getStravaAccessToken };
