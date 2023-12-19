import { randomBytes } from "crypto-browserify";

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
  const codeVerifier  = generateRandomString(64);
  
  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }
  
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  

export default function SpotifyLogin () { 
    sha256(codeVerifier).then(hashed => { 
        const codeChallenge = base64encode(hashed);
        const CLIENT = process.env.REACT_APP_CLIENT
        const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
        const appScope = 'user-read-private user-read-email user-top-read user-library-read'; //The scope used by the project 
    
        console.log("User pressed logged in."); 
        const spotifyLink = new URL("https://accounts.spotify.com/authorize");
        const state = randomBytes(20).toString('hex')
        spotifyLink.searchParams.append("client_id", CLIENT)
        spotifyLink.searchParams.append("response_type", "code")
        spotifyLink.searchParams.append("redirect_uri", REDIRECT_URI)
        spotifyLink.searchParams.append("state", state)
        spotifyLink.searchParams.append("scope", appScope)
        spotifyLink.searchParams.append("code_challenge_method", "S256")
        spotifyLink.searchParams.append("code_challenge", codeChallenge)
        console.log(spotifyLink.toString(), "")
        localStorage.setItem("code_verifier", codeVerifier)
        window.location.href=spotifyLink.toString(); 
    })
    
    return null;
}