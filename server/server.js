const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '518af3e8c49f4e5f97594f7d3f4f58ac',
        clientSecret: 'ee8a912e7f75460d8cb8578244764dee',
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
        redirectUri: 'http://localhost:3000',
        clientId: '518af3e8c49f4e5f97594f7d3f4f58ac',
        clientSecret: 'ee8a912e7f75460d8cb8578244764dee',
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


app.listen(3001)