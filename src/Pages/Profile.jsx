import { useEffect, useState } from "react";
import useProfileStatistics from "../hooks/useProfileStatistics";
import { CircularProgress } from "@mui/material";
import LikedSongs from "../Components/LikedSongs";
import Playlists from "../Components/Playlists";

export default function ProfilePage()  { 
  const access_token = sessionStorage.getItem("access_token")
    const token_type = sessionStorage.getItem("token_type")
  const { savedTracksFeatures } = useProfileStatistics(access_token, token_type);  
  const [savedTracksMeans, setSavedTracksMeans] = useState()

  useEffect(()=>{
    async function fetchData(){ 
      const data = await savedTracksFeatures(300)
      setSavedTracksMeans(data)
    }
    fetchData(); 
  }, [])

  return(
    savedTracksMeans ?
      <>
        <Playlists />
        <LikedSongs savedTracksMeans={savedTracksMeans} />
      </> 
    : <CircularProgress />)
}