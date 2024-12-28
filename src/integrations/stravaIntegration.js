const https = require('https');
const { getStravaAccessToken } = require('../config/strava');

async function fetchJson(url, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: headers
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

function convertPaceToMinPerMile(paceInMinPerKm) {
  const minPerMile = paceInMinPerKm * 1.60934;
  const minutes = Math.floor(minPerMile);
  const seconds = Math.round((minPerMile - minutes) * 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min/mile`;
}

function convertMetersToMiles(meters) {
  return meters * 0.000621371;
}

async function getStravaActivities() {
  const accessToken = await getStravaAccessToken();
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  const activitiesResponse = await fetchJson('https://www.strava.com/api/v3/athlete/activities', headers);

  console.log('Activities Response:', activitiesResponse);

  if (!Array.isArray(activitiesResponse)) {
    throw new Error('Invalid response from Strava API');
  }

  return activitiesResponse.map(activity => {
    const paceInMinPerKm = (activity.moving_time / 60) / (activity.distance / 1000);
    const paceInMinPerMile = convertPaceToMinPerMile(paceInMinPerKm);
    const distanceInMiles = convertMetersToMiles(activity.distance);

    return {
      name: activity.name,
      distance: distanceInMiles,
      pace: paceInMinPerMile,
      duration: new Date(activity.moving_time * 1000).toISOString().substr(11, 8), // Duration in HH:MM:SS
      elevation_gain: activity.total_elevation_gain,
      type: activity.type,
      date: activity.start_date,
      calories: activity.calories
    };
  });
}

module.exports = { getStravaActivities };
