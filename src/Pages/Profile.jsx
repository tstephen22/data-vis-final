import { useEffect, useState } from "react";
import useProfileStatistics from "../hooks/useProfileStatistics";
import { AppBar, Box, CircularProgress, Container, Toolbar, Typography, Tooltip, Button, Popover } from "@mui/material";
import LikedSongs from "../Components/LikedSongs";
import UserPlaylists from "../Components/UserPlaylists";

export default function ProfilePage()  { 
  const access_token = sessionStorage.getItem("access_token")
  const token_type = sessionStorage.getItem("token_type")
  const { savedTracksFeatures, getUserPlaylists, calculateOverallMeans, getProfile } = useProfileStatistics(access_token, token_type);  
  const [savedTracksMeans, setSavedTracksMeans] = useState()
  const [artist, setArtist] = useState()
  const [playlists, setPlaylists] = useState() 
  const [profile, setProfile] = useState()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(()=>{
    async function fetchData(){ 
      const profile = await getProfile()
      setProfile(profile)
      const data = await savedTracksFeatures(300)
      setSavedTracksMeans(data)
      const playlists = await getUserPlaylists()
      setPlaylists(playlists)
    }
    fetchData(); 
  }, [])

  return(
    savedTracksMeans && playlists && profile ?
      <div class="mainWrapper">
        <AppBar position="static" color="transparent">
          <Container maxWidth="x1">
            <Toolbar disableGutters>
              <img style={{display: { xs: 'none', md: 'flex' }, mr: 1, height: 60, width: 60, margin: 20}} src={profile.images[1].url} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#FFFF',
                  textDecoration: 'none',
                }}
              >
                {profile.display_name}
              </Typography>
              <Box sx={{flexGrow: 0}}>
                <Tooltip title="Explain metrics">
                  <Button variant="outlined" aria-describedby={id}  onClick={handleClick}>
                    Explain Metrics
                  </Button>
                </Tooltip>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    View these metrics for your liked songs and playlists! 
                    <br /> 
                    *Liked songs are mean average values
                    <br/><br/>
                    <i>Acousticness - </i> A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 
                    <br />1.0 represents high confidence the track is acoustic.
                    <br/><br/>
                    <i>Danceability - </i> how suitable a track is for dancing based on a combination of
                    <br/>musical elements including tempo, rhythm stability, beat strength, and overall regularity.
                    <br/>A value of 0.0 is least danceable and 1.0 is most danceable.
                    <br /> <br /> 
                    <i>Energy - </i>  measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, 
                    <br/>loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features 
                    <br />contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.
                    <br /> <br /> 
                    <i>Instrumentalness - </i> Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap 
                    <br />or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains 
                    <br />no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.
                    <br /> <br /> 
                    <i>Speechiness - </i> detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), 
                    <br/>the closer to 1.0 the attribute value.
                    <br /><br/>
                    <i>Valence - </i>A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, 
                    <br />cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
                    <br /><br/>
                    <i>*All definitions extracted from Spotify API.</i>
                  </Typography>
                </Popover>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <div class="main">
          <UserPlaylists userPlaylists={playlists} setPlaylists={setPlaylists} calculateOverallMeans={calculateOverallMeans} />
          <LikedSongs savedTracksMeans={savedTracksMeans} setArtist={setArtist} artist={artist}/>
        </div> 
      </div>
    : <CircularProgress />)
}