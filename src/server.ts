import express, { Request, Response } from 'express'
import https from 'https'
import querystring from 'querystring'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3000

app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1>Strava OAuth Integration</h1><p><a href="/auth">Click here to authorize with Strava</a></p>'
  )
})

app.get('/auth', (req: Request, res: Response) => {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:${PORT}/exchange_token&approval_prompt=force&scope=activity:read_all`
  res.redirect(authUrl)
})

app.get('/exchange_token', (req: Request, res: Response) => {
  const { code } = req.query

  const postData = querystring.stringify({
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code: code as string,
    grant_type: 'authorization_code',
  })

  const options: https.RequestOptions = {
    hostname: 'www.strava.com',
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  const request = https.request(options, (response) => {
    let data = ''

    response.on('data', (chunk) => {
      data += chunk
    })

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data)
        if (parsedData.errors) {
          res.status(400).send(`Error: ${parsedData.message}`)
        } else {
          res.send(
            `Access Token: ${parsedData.access_token}<br>Refresh Token: ${parsedData.refresh_token}`
          )
        }
      } catch (error) {
        res.status(500).send('Error parsing response data')
      }
    })
  })

  request.on('error', (e) => {
    res.status(500).send(`Error: ${e.message}`)
  })

  request.write(postData)
  request.end()
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
