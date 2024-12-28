const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

module.exports = { notion, databaseId };

