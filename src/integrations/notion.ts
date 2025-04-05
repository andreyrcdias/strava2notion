import { Client } from '@notionhq/client'
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { Activity } from '../types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function existsAcitivity(
  databaseId: string,
  activityId: number
): Promise<boolean> {
  const page: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'ID',
      number: {
        equals: activityId,
      },
    },
  })
  if (page.results.length == 0) {
    return false
  }
  const firstResult = page.results[0] as Record<string, any>
  const idProperty = firstResult.properties?.ID
  if (idProperty && idProperty.type == 'number') {
    if ((idProperty.number = activityId)) {
      return true
    }
  }
  return false
}

async function addToNotionDatabase(
  databaseId: string,
  activity: Activity
): Promise<void> {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        ID: {
          number: activity.id,
        },
        Name: {
          title: [
            {
              text: {
                content: activity.name,
              },
            },
          ],
        },
        Distance: {
          number: activity.distance,
        },
        Pace: {
          rich_text: [
            {
              text: {
                content: activity.pace,
              },
            },
          ],
        },
        Duration: {
          rich_text: [
            {
              text: {
                content: activity.duration,
              },
            },
          ],
        },
        'Elevation Gain': {
          number: activity.elevation_gain,
        },
        Type: {
          rich_text: [
            {
              text: {
                content: activity.type,
              },
            },
          ],
        },
        Date: {
          date: {
            start: activity.date,
          },
        },
        // 'Calories': {
        //   number: activity.calories || 0
        // }
      },
    })
  } catch (error) {
    console.error('Error adding to Notion database:', error)
  }
}

export { existsAcitivity, addToNotionDatabase }
