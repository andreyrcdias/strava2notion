import dotenv from 'dotenv'
import { getStravaActivities } from './integrations/strava'
import { addToNotionDatabase, existsAcitivity } from './integrations/notion'
import { Activity } from './types'
import { NOTION_DATABASE_ID } from './consts'

dotenv.config()

async function filterNewActivities(
  activities: Activity[]
): Promise<Activity[]> {
  const newActivities = await Promise.all(
    activities.map(async (activity) => {
      const exists = await existsAcitivity(
        NOTION_DATABASE_ID as string,
        activity.id
      )
      return exists ? null : activity
    })
  )
  return newActivities.filter((activity) => activity !== null) as Activity[]
}

// Main function
async function fillNotionDatabase(): Promise<void> {
  try {
    const activities: Activity[] = await getStravaActivities()
    console.log('Total activities fetched from Strava:', activities.length)

    const filteredActivities = await filterNewActivities(activities)
    console.log(
      'Total new activities to add in Notion:',
      filteredActivities.length
    )

    if (filteredActivities.length) {
      let activityAdded = 0
      for (const activity of filteredActivities) {
        await addToNotionDatabase(NOTION_DATABASE_ID as string, activity)
        activityAdded += 1
      }
      console.log('Total activities added:', activityAdded)
    }
  } catch (error) {
    console.error('Error filling Notion database:', error)
  }
}

fillNotionDatabase()
