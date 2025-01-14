import dotenv from 'dotenv';
import { getStravaActivities } from './integrations/strava';
import { addToNotionDatabase } from './integrations/notion';
import { Activity } from './types';

dotenv.config();

const NOTION_DATABASE_ID: string | undefined = process.env.NOTION_DATABASE_ID;


// Main function
async function fillNotionDatabase(): Promise<void> {
  try {
    const activities: Activity[] = await getStravaActivities();
    for (const activity of activities) {
      await addToNotionDatabase(NOTION_DATABASE_ID as string, activity);
    }
  } catch (error) {
    console.error('Error filling Notion database:', error);
  }
}

fillNotionDatabase();
