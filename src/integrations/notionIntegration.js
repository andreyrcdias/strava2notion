const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN});

async function addToNotionDatabase(databaseId, activity) {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: activity.name
              }
            }
          ]
        },
        'Distance': {
          number: activity.distance
        },
        'Pace': {
          rich_text: [
            {
              text: {
                content: activity.pace
              }
            }
          ]
        },
        'Duration': {
          rich_text: [
            {
              text: {
                content: activity.duration
              }
            }
          ]
        },
        'Elevation Gain': {
          number: activity.elevation_gain
        },
        'Type': {
          rich_text: [
            {
              text: {
                content: activity.type
              }
            }
          ]
        },
        'Date': {
          date: {
            start: activity.date
          }
        },
        'Calories': {
          number: activity.calories || 0
        }
      }
    });
  } catch (error) {
    console.error('Error adding to Notion database:', error);
  }
}

module.exports = { addToNotionDatabase };

