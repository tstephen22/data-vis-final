import { useEffect, useState } from "react";
import useProfileStatistics from "../hooks/useProfileStatistics";
import { CircularProgress } from "@mui/material";
import LikedSongs from "../Components/LikedSongs";
import UserPlaylists from "../Components/UserPlaylists";

export default function ProfilePage()  { 
  const access_token = sessionStorage.getItem("access_token")
  const token_type = sessionStorage.getItem("token_type")
  const { savedTracksFeatures, getUserPlaylists } = useProfileStatistics(access_token, token_type);  
  const [savedTracksMeans, setSavedTracksMeans] = useState()
  const [artist, setArtist] = useState()
  const [playlists, setPlaylists] = useState() 

  useEffect(()=>{
    async function fetchData(){ 
      const data = await savedTracksFeatures(300)
      setSavedTracksMeans(data)
      const playlists = await getUserPlaylists()
      setPlaylists(playlists)
    }
    fetchData(); 
  }, [])

  return(
    savedTracksMeans && playlists ?
      <>
        <UserPlaylists userPlaylists={playlists} setPlaylists={setPlaylists} />
        <LikedSongs savedTracksMeans={savedTracksMeans} setArtist={setArtist} artist={artist}/>
      </> 
    : <CircularProgress />)
}