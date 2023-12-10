import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { CircularProgress } from "@mui/material";


export default function Redirect() {

  const navigate = useNavigate(); 

  const getToken = (code) => { 
    const data = new URLSearchParams()
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
    const CLIENT = process.env.REACT_APP_CLIENT
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET 

    data.append("grant_type", 'client_credentials')
    data.append("code", code)
    data.append("redirect_uri", REDIRECT_URI)
    console.log(`Sending request for access token with code ${code}`)
    
    fetch(new Request('https://accounts.spotify.com/api/token', {
      method: 'post', 
      body: data.toString() 
    }), {
      headers:{
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT}:${CLIENT_SECRET}`).toString('base64')}`,
    }})
    .then((response) => { 
      if(response.ok) response.json().then(data => { 
        console.log("Response ok")
        const { access_token, token_type } = data
        sessionStorage.setItem("access_token", access_token)
        sessionStorage.setItem("token_type", token_type)
        navigate('/profile')
      })
      else throw Error(`Error response from fetch. Code: ${response.status}`)
    })
    .catch(error => { 
      console.log(error)
    })
  }

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => { 
    console.log(searchParams.get("code"))
    getToken(searchParams.get("code"))
  }, [searchParams])

  return (
    <div>
      <CircularProgress />
    </div>
  );
}
