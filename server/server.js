require('dotenv').config()
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder')
const axios = require('axios')

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRETE,
        refreshToken,
    })
    
    spotifyApi
      .refreshAccessToken()
      .then(data => {
        console.log('Token refreshed.');
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log("Couldn't refresh access token", err);
      });
});

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,

    });
    
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token, 
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

app.get('/lyrics', async(req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
  res.json({lyrics})
});
app.post('/translate', (req, res) => {
  const lyricsToTranslate = req.body.lyrics.substring(0,50)
  const options = {
    method: 'GET',
    url: 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get',
    params: {
      langpair: 'ja|en',
      q: lyricsToTranslate,
      mt: '1',
      onlyprivate: '0',
      de: 'epicarhan@gmail.com',
    },
    headers: {
      'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
      'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
    }
  }
  axios.request(options).then(data => {
    res.json({
      translation: data.data.responseData.translatedText
    })
  })
  // const len = req.body.lyrics.length
  // res.json({
  //   translation: len,
  // })
})


app.listen(3001)