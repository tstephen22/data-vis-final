import { useEffect, useState } from "react";
import { CircularProgress, Button, Slider, Tooltip as MuiToolTip, Box, Grid, Paper, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function LikedSongs({savedTracksMeans, setArtist, artist})  { 
    
    const colours = [{colour: "#0302FC", val: 0.0}, {colour: "#2A00D5", val: 0.2}, 
    {colour: "#63009E", val: 0.4}, {colour: "#A1015D", val: 0.6}, {colour: "#D80027", val: 0.8}, {colour: "#FE0002", val: 1}]
    const [cycle, setCycle] = useState(false)
    const [cycleInterval, setCycleInterval] = useState(0)
    const [showOverall, setOverall] = useState(true)
    const [means, setMeans] = useState()
    const [selectedTrack, setSelectedTrack] = useState() 
    const [overallMeans, setOverallMeans] = useState() 
    const [metrics, setMetrics] = useState() 
    const [index, setIndex] = useState(0); 

    const tableise = (data) => { 
      return([{
        metric: "Acousticness", 
        value: data.acousticness,
        overall: overallMeans.acousticness, 
        track: selectedTrack ? selectedTrack.features.acousticness : 0,
        fullMark: 1
      },
      {
        metric: "Danceability", 
        value: data.danceability,
        overall: overallMeans.danceability,
        track: selectedTrack ? selectedTrack.features.danceability : 0,
        fullMark: 1
      },
      {
        metric: "Energy", 
        value: data.energy,
        overall: overallMeans.energy, 
        track : selectedTrack ? selectedTrack.features.energy : 0,
        fullMark: 1
      },
      {
        metric: "Instrumentalness", 
        value: data.instrumentalness,
        overall: overallMeans.instrumentalness, 
        track: selectedTrack ? selectedTrack.features.instrumentalness : 0,
        fullMark: 1
      }, 
      {
        metric: "Speechiness", 
        value: data.speechiness,
        track: selectedTrack ? selectedTrack.features.speechiness : 0, 
        overall: overallMeans.speechiness, 
        fullMark: 1
      }])
    }

    const colorise = (value) => { 
      if(value < 0.2) return "#0302FC"
      else if(0.2 <= value < 0.4) return "#2A00D5"
      else if(0.4 <= value < 0.6) return "#63009E"
      else if(0.6 <= value < 0.8) return "#A1015D"
      else if(0.8 <= value < 1) return "#D80027"
      else return "#FE0002"
    }

    // USER INPUTS ----------------------------------------------------
    const showOverallMeans = () => { 
      setOverall((old) => !old)
    }
    const changeMonth = (event, val) => { 
      setIndex(val)
    }
    
    const clearCycle = () => { 
      clearInterval(cycleInterval)
      setCycleInterval(undefined)
      setCycle(false)
    }
    const iterate = () => { 
      setCycle(true)
      setIndex(0)
      const cycleId = setInterval(() => { 
        setIndex((oldIndex) => {
          const newIndex = oldIndex + 1
          if(newIndex >= means.length) {
            setCycle(false)
            return oldIndex
          }
          else return newIndex
        })
      }, 1000)
      setCycleInterval(cycleId)
    }

    const trackClicked = (index, trackId) => { 
      //Clear if they reclick the track
      if(selectedTrack && selectedTrack.id === trackId) { 
        setSelectedTrack(undefined)
        setArtist(undefined)
      } else { 
        setSelectedTrack(metrics.tracks[index])
        setArtist(metrics.tracks[index].artists[0])
      }
    }

    // USE EFFECTS ---------------------------------------------------
    useEffect(() => { 
        setMeans(savedTracksMeans.means)
        setMetrics(savedTracksMeans.means[0])
        setOverallMeans(savedTracksMeans.overallMeans) 
    }, [])

    useEffect(() => { 
      const newMetrics = means ? means[index] : {};
      setMetrics(newMetrics)
      
    }, [index])

    useEffect(() => { 
      if(!cycle && cycleInterval) clearInterval(cycleInterval)
    }, [cycle])
    //-------------------------------------------------------------------

    return (
        <div className="radarComponent">
          {
            means && metrics && overallMeans ?
            <>
            <div className="radarTitle">
              <p style={{marginBottom: 3}}>Your liked songs profile<i style={{marginLeft: 10}}> -  {overallMeans.trackCount} tracks</i></p>
              {
              selectedTrack && <p style={{marginTop: 4, marginBottom: 0, fontSize: 16}}>
                <i>{selectedTrack.name + " - " + selectedTrack.artists[0].name}</i>
                </p>
              }
            </div>
              <div className="radarWrapper">
                <div className="radar">
                  <ResponsiveContainer width="100%" height="100%"  minHeight={500} minWidth={800}> 
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tableise(metrics)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" /> 
                      <PolarRadiusAxis angle={45} domain={[0,1]}/>
                      <Tooltip contentStyle={{fontSize: 14}}/>
                      <Radar name="Month" dataKey="value" stroke={colorise(metrics.valence)} fill={colorise(metrics.valence)} fillOpacity={0.6} />
                      {showOverall && <Radar name="Overall" dataKey="overall" stroke="#8BF9F3" fill="#8BF9F3" fillOpacity={0.0} />}
                      {selectedTrack && <Radar name={selectedTrack.name} dataKey="track" stroke="#fcf6bd" fill="#fcf6bd" fillOpacity={0.0} />}
                      <Legend wrapperStyle={{fontSize: 14, marginBottom: 20}}/>
                    </RadarChart>
                  </ResponsiveContainer>
                  <div>
                    <MuiToolTip title={showOverall ? "Close" : "Show"} >
                      <Button variant="outlined" color={showOverall ? "error" : "success"} className="login" onClick={showOverallMeans}>
                        Overall {showOverall ? <HighlightOffIcon style={{marginLeft: 10}} /> : <AddCircleIcon style={{marginLeft: 10}}/>}  
                      </Button> 
                    </MuiToolTip>
                    <Grid container justifyContent="center" alignContent="center" sx={{marginTop: 3, marginBottom: 1}} spacing={1} direction="column"> 
                        {colours.reverse().map((colour) => (
                          <Grid key={colour.colour} item> 
                            <Paper 
                              sx={{
                                height: 50, 
                                width: 100, 
                                backgroundColor: colour.colour,
                                fontSize: 20,
                                display: "flex",
                                flexDirection: "column",
                                color: "white",
                                justifyContent: "center"}}
                            >{colour.val + (colour.val != 1 && "<")}  </Paper>
                          </Grid>
                        ))}
                    </Grid>
                    <div style={{color:"white", fontSize: 17}}>Valence</div>
                  </div>
                </div>
                <Grid container justifyContent="center" alignContent="content" spacing={1} direction="row"> 
                  {metrics.tracks && metrics.tracks.map((track, i) => (
                    <Grid key={track.id} item >
                      <MuiToolTip title={track.name + " - " + track.artists[0].name}>
                        <IconButton onClick={() => trackClicked(i, track.id)} sx={{padding: 0}}>
                          <Paper sx={{height:50, width:50,  border: selectedTrack && selectedTrack.id === track.id ? 3 : 0, borderColor: "#87c38f"}}>
                            <img className="trackImg" src={track.album.images[2].url} />
                          </Paper>
                        </IconButton>
                      </MuiToolTip>
                    </Grid> 
                  ))}
                </Grid>
                <p style={{color: "#8884d8"}}>{metrics.month}<i style={{marginLeft: 10}}>- {metrics.trackCount} tracks</i></p>
                <Slider style={{color: "#8884d8"}} aria-label="months" min={0} defaultValue={index} value={index} max={means.length-1} step={1} marks onChange={changeMonth}/>
                <div>
                  <Button variant="outlined" className="login" onClick={iterate} disabled={cycle}>
                    Cycle
                  </Button> 
                  {cycle && 
                    <MuiToolTip title="Stop">
                        <IconButton style={{marginLeft: 10}} variant="outlined" color="error" className="login" onClick={clearCycle}>
                        <HighlightOffIcon />
                      </IconButton>
                    </MuiToolTip>
                  }
                </div>
              </div>
              </>
            : 
            <CircularProgress />
          }
        </div>
      );
}