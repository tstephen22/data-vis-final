import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function Redirect() {

  const navigate = useNavigate(); 

  const getToken = (code, abortController) => { 
    const data = new URLSearchParams()
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
    const CLIENT = process.env.REACT_APP_CLIENT
    const codeVerifier = localStorage.getItem("code_verifier")

    data.append("grant_type", 'authorization_code')
    data.append("code", code)
    data.append("redirect_uri", REDIRECT_URI)
    data.append("client_id", CLIENT)
    data.append("code_verifier", codeVerifier)
    console.log(`Sending request for access token with code ${code}`)
    
    fetch(new Request('https://accounts.spotify.com/api/token', {
      method: 'post', 
      body: data.toString() 
    }), {
      headers:{
        'content-type': 'application/x-www-form-urlencoded',
      },
      signal: abortController.signal
    })
    .then((response) => { 
      if(response.ok) response.json().then(data => { 
        console.log("Response ok")
        const { access_token, token_type } = data
        sessionStorage.setItem("access_token", access_token)
        sessionStorage.setItem("token_type", token_type)
        localStorage.setItem("code_verifier", codeVerifier)
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
    const abortController = new AbortController(); 
    getToken(searchParams.get("code"), abortController)
    return () => abortController.abort(); 
  }, [])

  return (
    <div>
      <CircularProgress />
    </div>
  );
}
