import { useEffect, useState } from "react";
import useSpotifyData from "../hooks/useSpotifyData";

export default function ProfilePage()  { 
    const access_token = sessionStorage.getItem("access_token")
    const token_type = sessionStorage.getItem("token_type")
    const { getProfileDetails, getTopTracks } = useSpotifyData(access_token, token_type);

    const [profile, setProfile] = useState()

    useEffect(() => { 
      getProfileDetails().then(profileData => { 
        setProfile(profileData)
      })
      .catch((err) => console.log(err))
      getTopTracks().then(topTracksData => { 
        console.log(topTracksData.tracks)
      })
    }, [])
    
    return (
        <div>

          <p>{profile ? `Hello ${profile.display_name}!` : "Profile name not found "}</p>
        </div>
      );
}