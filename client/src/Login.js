import React from 'react'
import { Container } from "react-bootstrap"

const client_id = '518af3e8c49f4e5f97594f7d3f4f58ac';

const scopes = `streaming%20user-read-email%20user-read-private%20user-
library-read%20user-library-modify%20user-read-playback-state%20
user-modify-playback-state`;

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&
response_type=code&redirect_uri=http://localhost:3000&scope=${scopes}`;

export default function Login() {
  return (
    <Container className='d-flex justify-content-center align-items' style={{minHeight:"100vh"}}>
        <a className='btn btn-success btn-lg' href={AUTH_URL}>
            Login with Spotify
        </a>
    </Container>
  )
}
