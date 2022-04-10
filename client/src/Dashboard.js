import { useState, useEffect } from 'react'
import React from 'react'
import useAuth from './useAuth'
import {Container, Form} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'

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

    spotifyApi.searchTracks(search)
    .then(res => {
      console.log(res)
    })
  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' 
    style={{height:"100vh"}}>
      <Form.Control type="search" placeholder='Search Songs/Artists'
      value = {search} onChange={e=>setSearch(e.target.value)}/>
    <div className='flex-grow-1 my-2' style={{overflowY:"auto"}}>
      Songs
    </div>
    <div> Bottom</div>
    </Container>
  )
}
