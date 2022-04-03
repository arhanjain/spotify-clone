
export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectURI = "http://localhost:3000/";

const clientID = "4ddab43a21884f0c8f73b1fd8f3b1e6b"

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
];

export const getTokenFromURL = () => {
  return window.location.hash.substring(1).split('&')
  .reduce((previous, item) => {
    var parts = item.split('=');
    previous[parts[0]] = decodeURIComponent(parts[1]);

    return previous;
  }, {});
}

export const loginURL = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
