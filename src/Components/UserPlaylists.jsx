import { ExpandCircleDown, Wifi2Bar } from "@mui/icons-material"
import { Accordion,  AccordionSummary, Typography, List, AccordionDetails, Paper, IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import { Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, PolarAngleAxis } from "recharts"
import useProfileStatistics from "../hooks/useProfileStatistics"
export default function UserPlaylists({userPlaylists, calculateOverallMeans}) { 
    
    //Request for artist information ----------------
    const [playlists, setPlaylists] = useState() 
    const [graphs, setGraphs] = useState()
    const [showRadial, setShowRadial] = useState(false)
    const [playlistOverall, setPlaylistOverall] = useState()

    const makeGraphs = (playlists) => { 
        let playlistsGraphs = []
        let radialGraphs = []
        playlists.forEach((playlist) => {
            let data = []; 
            playlist.tracks.features.features.forEach((trackFeature, i) => { 
                if(!trackFeature) return; 
                const track = playlist.tracks.features.tracks[i].track
                data.push({
                    name: data.length+1 + " - " + track.name, 
                    trackCount: 1,
                    image_uri: track.album.images[0].url,
                    acousticness: trackFeature.acousticness, 
                    danceability: trackFeature.danceability, 
                    speechiness: trackFeature.speechiness, 
                    valence: trackFeature.valence, 
                    energy: trackFeature.energy,
                    instrumentalness: trackFeature.instrumentalness
                })
            })
            const overall = calculateOverallMeans(data)
            const overallData = [
            {
                "name": "Scale",
                "value": 0,
                "fill": "#00000"
            },
            {
                "name": "Acousticness", 
                "value": overall.acousticness,
                "fill": "#ef476f"
            },
            {
                "name": "Danceability", 
                "value": overall.danceability,
                "fill": "#a63c06"
            },
            {
                "name": "Speechiness", 
                "value": overall.speechiness,
                "fill": "#74a57f"
            },
            {
                "name": "Valence", 
                "value": overall.valence,
                "fill": "#118ab2"
            },
            {
                "name": "Energy", 
                "value": overall.energy,
                "fill": "#073b4c"
            },
            {
                "name": "Instrumenalness", 
                "value": overall.instrumentalness,
                "fill": "#3a0ca3"
            },
            {
                "name": "Scale",
                "value": 1,
                "fill": "#00000"
            }]
            radialGraphs.push(overallData)
            playlistsGraphs.push(data)
            data = []
        })
        
        console.log(playlists)
        setGraphs(playlistsGraphs)
        setPlaylistOverall(radialGraphs)
    }

    const showRadialFunc = () =>{
        setShowRadial((old) => !old)
    }

    //Use effects --------------------------------------------------
    useEffect(() => { 
        setPlaylists(userPlaylists.items)
        makeGraphs(userPlaylists.items)
    }, [])

    useEffect(() => { 
        console.log(!!playlists, !!graphs)
    }, [playlists, graphs])
    //---------------------------------------------------------------
    const CustomToolTip = ({active, payload, label, graphData}) => { 
        if(active && payload && payload.length){
            const data = graphData.filter((val) => val.name === label)
            const image = data[0].image_uri
            return (
                <div style={{
                    display: "flex", 
                    flexDirection: "column",
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "rgb(248, 248, 255, 0.8)",
                    border: 3,
                    borderRadius: 3,
                    padding: 10,
                }}>
                    <p className="tooltipLabel">{label}</p>
                    <div>
                    <img style={{maxHeight: "100%", maxWidth: "100%", height: 40, width: 40}} src={image} /></div>
                    <p style={{color:"#ef476f"}}>{`${payload[0].name} - ${payload[0].value}`}</p>
                    <p style={{color:"#a63c06"}}>{`${payload[1].name} - ${payload[1].value}`}</p>
                    <p style={{color:"#74a57f"}}>{`${payload[2].name} - ${payload[2].value}`}</p>
                    <p style={{color:"#118ab2"}}>{`${payload[3].name} - ${payload[3].value}`}</p>
                    <p style={{color:"#073b4c"}}>{`${payload[4].name} - ${payload[4].value}`}</p>
                    <p style={{color:"#3a0ca3"}}>{`${payload[5].name} - ${payload[5].value}`}</p>
                </div>
            )
        }
        return null;
    }

    const CustomRadialTip = ({active, payload, label, index}) => {
        if(active && payload && payload.length){
            const newLabel = playlistOverall[index][label].name
            return(<div style={{
                display: "flex", 
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: "rgb(248, 248, 255, 0.8)",
                border: 3,
                borderRadius: 3,
                padding: 10,
            }}>
                <p className="tooltipLabel">{newLabel}</p>
                <p>{`${payload[0].name} - ${payload[0].value}`}</p>
            </div>)
        } return null
    }

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
                    borderColor: "#8BF9F3"
                    }}>
                    <AccordionSummary expandIcon={<ExpandCircleDown htmlColor="#8BF9F3"/>} id={playlists[i].id}>
                        <img style={{maxHeight: "100%", maxWidth: "100%", height: 40, width: 40, marginRight: 10}} src={playlists[i].images[0].url} />
                        <Typography color="#8BF9F3">{playlists[i].name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{height: 300, minWidth: "100%", fontSize: 10, display:'flex', flexDirection: 'row'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart width="100%" height={250} data={graphData}>
                                <XAxis dataKey="name" /> 
                                <YAxis /> 
                                <Tooltip content={(<CustomToolTip graphData={graphData}/>)}/>
                                <Legend />
                                <Line type="monotone" dataKey="acousticness" stroke="#ef476f" />
                                <Line type="monotone" dataKey="danceability" stroke="#ffd166" />
                                <Line type="monotone" dataKey="speechiness" stroke="#06d6a0" />
                                <Line type="monotone" dataKey="energy" stroke="#118ab2" />
                                <Line type="monotone" dataKey="valence" stroke="#073b4c" />
                                <Line type="monotone" dataKey="instrumentalness" stroke="#3a0ca3" />
                            </LineChart> 
                        </ResponsiveContainer>
                        {showRadial && 
                            <ResponsiveContainer width="100%" height="100%" >
                                <RadialBarChart
                                    width={300} height={250} innerRadius="10%" outerRadius="95%" data={playlistOverall[i]} startAngle={180} endAngle={540}>
                                    <RadialBar minAngle={15} label={{ fill: '#FFFF', position: 'insideStart' }} dataKey='value' style={{color:'#FFFFF'}}/>
                                    <Legend iconSize={10} />
                                    <Tooltip contentStyle={{fontSize: 14}} content={(<CustomRadialTip index={i}/>)}/>
                                </RadialBarChart>        
                            </ResponsiveContainer>
                        }
                        <IconButton onClick={showRadialFunc} sx={{height:35, width:35, color: "#8BF9F3", marginRight:3, marginLeft: 3, border: 1, borderColor:"#8BF9F3" }}>
                            <Wifi2Bar />
                        </IconButton>
                    </AccordionDetails>
                </Accordion> 
            )})}
            </List>
        </div>
    </div>)
}