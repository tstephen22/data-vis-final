import { randomBytes } from "crypto-browserify";

export default function SpotifyLogin () { 
    const CLIENT = process.env.REACT_APP_CLIENT
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET 
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
    const stateKey = 'spotify_auth_state';
    const appScope = 'user-read-private user-read-email user-top-read'; //The scope used by the project 

    console.log(CLIENT)
    console.log(REDIRECT_URI)
    console.log("User pressed logged in."); 
    const spotifyLink = new URL("https://accounts.spotify.com/authorize");
    const state = randomBytes(20).toString('hex')
    spotifyLink.searchParams.append("client_id", CLIENT)
    spotifyLink.searchParams.append("response_type", "code")
    spotifyLink.searchParams.append("redirect_uri", REDIRECT_URI)
    spotifyLink.searchParams.append("state", state)
    spotifyLink.searchParams.append("scope", appScope)
    console.log(spotifyLink.toString(), "")
    window.location.href=spotifyLink.toString(); 
    
    return null;
}