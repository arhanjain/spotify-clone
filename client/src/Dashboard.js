import { useState, useEffect } from 'react'
import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'

const spotifyApi = new SpotifyWebApi({
  clientId: '518af3e8c49f4e5f97594f7d3f4f58ac',
  
})

export default function Dashboard({ code }) {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const accessToken = useAuth(code)

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
      <TrackSearchResult track={track} key={track.uri} />
      ))}
    </div>
    <div> Bottom</div>
    </Container>
  )
}
