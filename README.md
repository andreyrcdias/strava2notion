# strava2notion
Based on [Log Strava Activity in Notion](https://developers.notion.com/page/log-strava-activity-in-notion)
* [Strava API v3](https://developers.strava.com/docs/reference/)
* [Notion API Reference](https://developers.notion.com/reference/intro)


## Prerequisites
- Node.js
- A Strava Developer account
- A Notion account


## Step 1: Get API Keys
### Strava API Key

- Log in to your Strava account.
- Go to [Strava API](https://www.strava.com/login).
- Click on Create An App.
- Fill in the required details and click Create.
- Copy the Client ID and Client Secret.

### Notion API Key
- Log in to your Notion account.
- Go to [Notion Integrations](https://www.notion.so/my-integrations).
- Click on New Integration.
- Fill in the required details and click Submit.
- Copy the generated Internal Integration Token.

## Step 2: Set Up Your Notion Database
1. Create a new database in Notion with the following properties:
- Name (Title)
- Distance (Number)
- Pace (Text)
- Duration (Text)
- Elevation Gain (Number)
- Type (Text)
- Date (Date)
- Calories (Number)
2. Share the database with your integration:
- Click on the three dots in the top-right corner of the page.
- Under Connections, click on Connect to and search for your integration and invite it.

## Step 3: Create .env file
```shell
cp .env-example .env
```
> [!WARNING]
> Please note that you will have to update your .env file with your `STRAVA_ACCESS_TOKEN` and `STRAVA_REFRESH_TOKEN` after completing Strava’s OAuth flow.

## Step 4: Install Packages
```shell
npm install
```

## Step 5: Build the project
```shell
npm run build
```

## Step 6: Run the OAuth Flow
1. Start the OAuth Server:
```shell
node run server
```
2. Open your browser and navigate to http://localhost:3000:
    - You should see a page with a link to authorize with Strava.
3. Click the link to authorize with Strava:
    - This will redirect you to Strava's authorization page.
4. Authorize the application:
    - Strava will redirect you to a page with an authorization code.
5. The server will exchange the authorization code for an access token and refresh token:
    - The tokens will be displayed on the page.
6. Copy the refresh token and update your .env file with it.


## Step 7: Run the Integration
```shell
npm start
```
