import { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import { getTokenFromURL } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

function App() {

  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = getTokenFromURL();
    window.location.hash = "";
    const _token = hash.access_token;;
    
    if (_token) {
      setToken(_token);
      spotify.setAccessToken(_token);
      spotify.getMe().then((user) => {
        console.log(user);
      });
      // console.log("lmaoo", temp);
    }

  }, []);

  return (
    <div className="app">
      {
        token ? (
          <h1>Logged in</h1>
        ) : (
          <Login />
        )
      }
    </div>
  );
}

export default App;
