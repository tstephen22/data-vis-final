import { ExpandCircleDown, Wifi2Bar, LegendToggle } from "@mui/icons-material"
import { Accordion,  AccordionSummary, Typography, List, AccordionDetails, Paper, IconButton, Tooltip as MuiTooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, PolarAngleAxis, ReferenceLine } from "recharts"
import useProfileStatistics from "../hooks/useProfileStatistics"
export default function UserPlaylists({userPlaylists, calculateOverallMeans}) { 
    
    //Request for artist information ----------------
    const [playlists, setPlaylists] = useState() 
    const [graphs, setGraphs] = useState()
    const [showRadial, setShowRadial] = useState()
    const [reference, setReference] = useState() 
    const [playlistOverall, setPlaylistOverall] = useState()
    const [showReference, setShowReference] = useState()

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
                "name": "Instrumentalness", 
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

    const getColor = (metric) => { 
        switch(metric) { 
            case "Scale": 
                return "#00000";
            case "Acousticness": 
                return "#ef476f"
            case "Danceability":
                return "#a63c06"
            case "Speechiness": 
                return "#74a57f"
            case "Valence":
                return "#118ab2"
            case "Energy": 
                return "#073b4c"
            case "Instrumentalness": 
                return "#3a0ca3"
        }
    }

    const showRadialFunc = (id) =>{
        setShowRadial((old) => {
            if(old === id) return undefined
            else return id
        })
    }

    const showReferenceFunc = (id) => { 
        setShowReference((old) => {
            if(old === id) return undefined
            else return id
        })
    }

    //Use effects --------------------------------------------------
    useEffect(() => { 
        setPlaylists(userPlaylists.items)
        makeGraphs(userPlaylists.items)
    }, [])

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

    const CustomRadialTip = ({active, payload, label, index, graphId}) => {
        if(active && payload && payload.length){
            const newLabel = playlistOverall[index][label].name
            setReference({
                value: payload[0].value, 
                id: graphId,
                name: newLabel, 
                color: getColor(newLabel)
            })
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
        } 
        setReference(null)
        return null
    }

    return(
    <div style={{minWidth:"50%", marginRight: 30}}>
        <div className="playlistTitle">
            <p style={{marginLeft: 30, marginTop:0, marginBottom: 0}}>Your Playlists <i>- {playlists && playlists.length} playlists</i></p></div>
        <div className="profileWrapper">
            <List sx={{
                maxWidth: '100%', 
                maxHeight: '100%',
                width: 900, 
                position: 'relative',
                overflow: 'auto',
                maxHeight: 900,
                marginTop: 5,
                 
        '& ul': { padding: 5 },
            }}>
            {playlists && graphs && graphs.map((graphData, i) =>{
                return (
                <Accordion sx={{ 
                    margin: 2, 
                    backgroundColor: "#282c34", 
                    border: 2,
                    borderColor: "#8BF9F3"
                    }}>
                    <AccordionSummary expandIcon={<ExpandCircleDown htmlColor="#8BF9F3"/>} id={playlists[i].id}>
                        <img style={{maxHeight: "100%", maxWidth: "100%", height: 40, width: 40, marginRight: 10}} src={playlists[i].images[0].url} />
                        <Typography color="#8BF9F3">{playlists[i].name} - <i>{playlists[i].tracks.total} tracks</i></Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{height: 500, minWidth: "100%", fontSize: 10, display:'flex', flexDirection: 'row'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart width="100%" height={300} data={graphData}>
                                <XAxis dataKey="name" /> 
                                <YAxis /> 
                                <Tooltip content={(<CustomToolTip graphData={graphData}/>)}/>
                                <Legend />
                                {showReference === playlists[i].id && reference && reference.id === playlists[i].id && <ReferenceLine y={reference.value} stroke={reference.color} label={reference.name} isFront strokeWidth={3} /> }
                                <Line type="monotone" dataKey="acousticness" stroke="#ef476f" />
                                <Line type="monotone" dataKey="danceability" stroke="#ffd166" />
                                <Line type="monotone" dataKey="speechiness" stroke="#06d6a0" />
                                <Line type="monotone" dataKey="energy" stroke="#118ab2" />
                                <Line type="monotone" dataKey="valence" stroke="#073b4c" />
                                <Line type="monotone" dataKey="instrumentalness" stroke="#3a0ca3" />
                            </LineChart> 
                        </ResponsiveContainer>
                        {showRadial === playlists[i].id && 
                            <ResponsiveContainer width="100%" height="80%">
                                <p style={{color: '#FFFF', fontSize: 20}}>Average values</p>
                                <RadialBarChart 
                                    width={270} height={230} innerRadius="10%" outerRadius="95%" data={playlistOverall[i]} startAngle={180} endAngle={540}>
                                    <RadialBar minAngle={15} label={{ fill: '#FFFF', position: 'insideStart' }} dataKey='value' style={{color:'#FFFFF'}}/>
                                    <Legend iconSize={10} />
                                    <Tooltip contentStyle={{fontSize: 14}} content={(<CustomRadialTip index={i} graphId={playlists[i].id}/>)}/>
                                </RadialBarChart>        
                            </ResponsiveContainer>
                        }
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <MuiTooltip title={showRadial && showRadial === playlists[i].id ? "Close Radial" : "Show Radial"} >
                                <IconButton onClick={() => showRadialFunc(playlists[i].id)} color={showRadial ? "error" : "success"} 
                                    sx={{height:35, width:35, marginRight:3, marginBottom: 2, border: 1}}>
                                    <Wifi2Bar />
                                </IconButton>
                            </MuiTooltip>
                            {showRadial === playlists[i].id && 
                            <MuiTooltip title={showReference && showRadial === playlists[i].id ? "Close Reference lines" : "Show Reference lines"} >
                                <IconButton onClick={() => showReferenceFunc(playlists[i].id)}  color={showReference ? "error" : "success"}  sx={{height:35, width:35,  marginRight:3, marginTop: 1, border: 1 }}>
                                    <LegendToggle />
                                </IconButton>
                            </MuiTooltip>}
                        </div>
                    </AccordionDetails>
                </Accordion> 
            )})}
            </List>
        </div>
    </div>)
}