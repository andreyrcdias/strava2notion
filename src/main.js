require('dotenv').config();

const { getStravaActivities } = require('./integrations/stravaIntegration');
const { addToNotionDatabase } = require('./integrations/notionIntegration');

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Main function to fill the Notion database with Strava activities
async function fillNotionDatabase() {
  try {
    const activities = await getStravaActivities();
    
    for (const activity of activities) {
      await addToNotionDatabase(NOTION_DATABASE_ID, activity);
      console.log(`Added to Notion: Name: ${activity.name}, Distance: ${activity.distance}, Pace: ${activity.pace}`);
    }
  } catch (error) {
    console.error('Error filling Notion database:', error);
  }
}

fillNotionDatabase();

