import { ExpandCircleDown } from "@mui/icons-material"
import { Accordion,  AccordionSummary, Typography, List, AccordionDetails } from "@mui/material"
import { useEffect, useState } from "react"
import { Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart } from "recharts"

export default function UserPlaylists({userPlaylists}) { 
    //Request for artist information ----------------
    const [playlists, setPlaylists] = useState() 
    const [graphs, setGraphs] = useState()

    const makeGraphs = (playlists) => { 
        let playlistsGraphs = []
        playlists.forEach((playlist) => {
            let data = []; 
            playlist.tracks.features.features.forEach((trackFeature, i) => { 
                if(!trackFeature) return; 
                const track = playlist.tracks.features.tracks[i].track
                data.push({
                    name: track.name, 
                    acousticness: trackFeature.acousticness, 
                    danceability: trackFeature.danceability, 
                    speechiness: trackFeature.speechiness, 
                    valence: trackFeature.valence, 
                    energy: trackFeature.energy,
                    instrumentalness: trackFeature.instrumentalness
                })
            })
            playlistsGraphs.push(data)
            data = []
        })
        console.log(playlistsGraphs)
        console.log(playlists)
        setGraphs(playlistsGraphs)
    }
    
    useEffect(() => { 
        setPlaylists(userPlaylists.items)
        makeGraphs(userPlaylists.items)
    }, [])

    useEffect(() => { 
        console.log(!!playlists, !!graphs)
    }, [playlists, graphs])

    return(
    <div style={{minWidth:"50%"}}>
        <div className="playlistTitle"><p style={{marginLeft: 30, marginTop:30, marginBottom: 0}}>Your Playlists</p></div>
        <div className="profileWrapper">
            <List sx={{
                maxWidth: '100%', 
                maxHeight: '100%',
                width: 800, 
                position: 'relative',
                overflow: 'auto',
                maxHeight: 750,
                marginTop: 5,
                marginLeft: -10, 
        '& ul': { padding: 5 },
            }}>
            {playlists && graphs && graphs.map((graphData, i) =>{
                console.log("graphData", graphData)
                return (
                <Accordion sx={{ 
                    margin: 2, 
                    backgroundColor: "#282c34", 
                    border: 2,
                    borderColor: "#8BF9F3" }}>
                    <AccordionSummary expandIcon={<ExpandCircleDown htmlColor="#8BF9F3"/>} id={playlists[i].id}>
                        <Typography color="#8BF9F3">{playlists[i].name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{height: 300, width: 700, fontSize: 10}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart width="100%" height={250} data={graphData}>
                                <XAxis dataKey="name" /> 
                                <YAxis /> 
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="acousticness" stroke="#ef476f" />
                                <Line type="monotone" dataKey="danceability" stroke="#ffd166" />
                                <Line type="monotone" dataKey="speechiness" stroke="#06d6a0" />
                                <Line type="monotone" dataKey="energy" stroke="#118ab2" />
                                <Line type="monotone" dataKey="valence" stroke="#073b4c" />
                                <Line type="monotone" dataKey="instrumentalness" stroke="#3a0ca3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </AccordionDetails>
                </Accordion> 
            )})}
            </List>
        </div>
    </div>)
}