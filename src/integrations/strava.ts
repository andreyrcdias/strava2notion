import https from 'https';
import { getStravaAccessToken } from '../config/strava';
import { Activity, StravaActivity } from '../types';

async function fetchJson(url: string, headers: Record<string, string>): Promise<any> {
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

function convertPaceToMinPerKm(paceInMinPerKm: number): string {
  const minutes = Math.floor(paceInMinPerKm);
  const seconds = Math.round((paceInMinPerKm - minutes) * 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min/km`;
}

async function getStravaActivities(): Promise<Activity[]> {
  const accessToken = await getStravaAccessToken();
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  const getActivitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
  let page = 1;
  const perPage = 30;
  let activities: StravaActivity[] = [];

  while (true) {
    const activitiesResponse: StravaActivity[] = await fetchJson(`${getActivitiesUrl}?page=${page}&per_page=${perPage}`, headers);
    if (activitiesResponse.length === 0) {
      break;
    }
    activities = activities.concat(activitiesResponse);
    page++;
  }

  if (!Array.isArray(activities)) {
    throw new Error('Invalid response from Strava API');
  }

  return activities.map(activity => {
    const paceInMinPerKm = convertPaceToMinPerKm((activity.moving_time / 60) / (activity.distance / 1000));
    const distanceInKm = Math.round((activity.distance / 1000) * 100) / 100; // Round to 2 decimal places

    return {
      id: activity.id,
      name: activity.name,
      distance: distanceInKm,
      pace: paceInMinPerKm,
      duration: new Date(activity.moving_time * 1000).toISOString().substr(11, 8), // Duration in HH:MM:SS
      elevation_gain: activity.total_elevation_gain,
      type: activity.type,
      date: activity.start_date,
      // calories: activity.calories  // TODO: we need to getActivityById to retrieve this info.
    };
  });
}

export { getStravaActivities };
