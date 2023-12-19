import { useEffect, useState } from "react";
import useProfileStatistics from "../hooks/useProfileStatistics";
import { CircularProgress, Button, Slider, Slide } from "@mui/material";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

export default function ProfilePage()  { 
    const access_token = sessionStorage.getItem("access_token")
    const token_type = sessionStorage.getItem("token_type")
    const { savedTracksFeatures } = useProfileStatistics(access_token, token_type);  

    const [cycle, setCycle] = useState(false)
    const [cycleInterval, setCycleInterval] = useState(0)
    const [showOverall, setOverall] = useState(true)
    const [means, setMeans] = useState()
    const [overallMeans, setOverallMeans] = useState() 
    const [metrics, setMetrics] = useState() 
    const [index, setIndex] = useState(0); 

    const tableise = (data) => { 
      return([{
        metric: "Acousticness", 
        value: data.acousticness,
        overall: overallMeans.acousticness, 
        fullMark: 1
      },
      {
        metric: "Danceability", 
        value: data.danceability,
        overall: overallMeans.danceability,
        fullMark: 1
      },
      {
        metric: "Energy", 
        value: data.energy,
        overall: overallMeans.energy, 
        fullMark: 1
      },
      {
        metric: "Instrumentalness", 
        value: data.instrumentalness,
        overall: overallMeans.instrumentalness, 
        fullMark: 1
      }, 
      {
        metric: "Speechiness", 
        value: data.speechiness,
        overall: overallMeans.speechiness, 
        fullMark: 1
      }])
    }
    // USER INPUTS ----------------------------------------------------
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

    // USE EFFECTS ---------------------------------------------------
    useEffect(() => { 
      async function fetchData(){ 
        const savedTracksMeans = await savedTracksFeatures(300) 
        setMeans(savedTracksMeans.means)
        setMetrics(savedTracksMeans.means[0])
        setOverallMeans(savedTracksMeans.overallMeans)
      }
      fetchData(); 
    }, [])

    useEffect(() => { 
      const newMetrics = means ? means[index] : {};
      setMetrics(newMetrics)
      console.log("New metrics ", newMetrics)
      
    }, [index])

    useEffect(() => { 
      if(!cycle && cycleInterval) clearInterval(cycleInterval)
    }, [cycle])
    //-------------------------------------------------------------------

    return (
        <div>
          {
            means && metrics ? 
            <div>
              <ResponsiveContainer width="100%" height="100%"  minHeight={500} minWidth={800}> 
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tableise(metrics)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" /> 
                  <PolarRadiusAxis angle={45} domain={[0,1]}/>
                  <Radar name="Month" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  {showOverall && <Radar name="Overall" dataKey="overall" stroke="#990000" fill="#990000" fillOpacity={0.45} />}
                </RadarChart>
              </ResponsiveContainer>
              <p color="white">{metrics.month}</p>
              <Slider aria-label="months" min={0} defaultValue={index} value={index} max={means.length-1} step={1} marks onChange={changeMonth}/>
              <div>
                <Button variant="outlined" className="login" onClick={iterate} disabled={cycle}>
                  CYCLE
                </Button> 
                {cycle && <Button variant="outlined" className="login" onClick={clearCycle}>
                  STOP
                </Button>}
              </div>
            </div>
            : 
            <CircularProgress />
          }
        </div>
      );
}