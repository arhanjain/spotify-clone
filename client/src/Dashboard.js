import { useState, useEffect } from 'react'
import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import axios from 'axios'
import { Grid, Paper } from '@mui/material'
import Button from '@mui/material/Button'

const spotifyApi = new SpotifyWebApi({
  clientId: '518af3e8c49f4e5f97594f7d3f4f58ac',
  
})

export default function Dashboard({ code }) {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")
  const [translation, setTranslation] = useState("")
  const accessToken = useAuth(code)

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }

  function translateLyrics(lyrics) {
    if(!lyrics) return

    console.log("I AM")
    axios.post('http://localhost:3001/translate', {
      lyrics,
    }).then(res => {
      setTranslation(res.data.translation)
    })
  }

  useEffect(() => {
    if (!playingTrack) return
    axios.get('http://localhost:3001/lyrics', {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then(res => {
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

  useEffect(()=> {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if(!search) return setSearchResults([])

    let cancel = false
    spotifyApi.searchTracks(search)
    .then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestImage = track.album.images.reduce(
            (smallestImage, image) => {
              if (image.height < smallestImage.height) return image;
              return smallestImage
            }, track.album.images[0]
          )
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestImage.url
          }
        })
      )
    })

    return () => {
      cancel = true;
    }
  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' 
    style={{height:"100vh"}}>
      <Form.Control type="search" placeholder='Search Songs/Artists'
      value = {search} onChange={e=>setSearch(e.target.value)}/>
    <div className='flex-grow-1 my-2' style={{overflowY:"auto"}}>
      {searchResults.map(track => (
      <TrackSearchResult track={track} key={track.uri}  chooseTrack={chooseTrack} />
      ))}
      {searchResults.length === 0 && (
        <Grid container columns={12} spacing={0.5}>
          <Grid item xs={6}>
            <Paper elevation={2}>
              {lyrics}
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={2}>
              {translation}
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
    <Button variant='contained' onClick={() => translateLyrics(lyrics)}>Translate</Button>
    <div>
      <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
    </div>
    </Container>
  )
}
