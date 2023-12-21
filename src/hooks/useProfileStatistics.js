import useSpotifyData from "./useSpotifyData";
export default function useProfileStatistics(access_token, token_type) { 
    const { getTopTracks, getProfile, getSavedTracks, getTrackFeatures, getPlaylists } = useSpotifyData(access_token, token_type)

    const monthOnlyString = (date) => { 
        const month = date.getMonth() 
        const year = date.getFullYear() 
        let str; 
        switch(month){ 
            case 0 : 
                str = "Jan"
                break; 
            case 1 : 
                str = "Feb"
                break; 
            case 2 : 
                str = "Mar"
                break; 
            case 3 : 
                str = "Apr"
                break; 
            case 4 : 
                str = "May"
                break; 
            case 5 : 
                str = "Jun"
                break; 
            case 6 : 
                str = "Jul"
                break; 
            case 7 : 
                str = "Aug"
                break; 
            case 8 : 
                str = "Sep"
                break; 
            case 9 : 
                str = "Oct"
                break; 
            case 10 : 
                str = "Nov"
                break; 
            case 11 : 
                str = "Dec"
                break; 
        }
        str += ` ${year}`
        return str
    }

    const calculateTimeMeans = (tracks) => { 
        const monthMeans = [] 
        let curDate = tracks[0].addedAt
        let curMeans =  { 
            trackCount: 0, 
            acousticness: 0, 
            danceability: 0, 
            energy: 0, 
            instrumentalness: 0, 
            speechiness: 0,
            valence: 0,
            tracks: [] 
        } 
        for(const track of tracks){
            if(curDate.getMonth() != track.addedAt.getMonth()) { 
                monthMeans.push({ 
                    month: monthOnlyString(curDate),
                    trackCount : curMeans.trackCount, 
                    acousticness: +(curMeans.acousticness / curMeans.trackCount).toFixed(5),
                    danceability: +(curMeans.danceability / curMeans.trackCount).toFixed(5),
                    energy : +(curMeans.energy / curMeans.trackCount).toFixed(5), 
                    instrumentalness : +(curMeans.instrumentalness / curMeans.trackCount).toFixed(5), 
                    speechiness: +(curMeans.speechiness / curMeans.trackCount).toFixed(5),
                    valence: +(curMeans.valence / curMeans.trackCount).toFixed(5),
                    tracks: curMeans.tracks
                })
                // reset
                curMeans = { 
                    trackCount: 1, 
                    acousticness: +track.features.acousticness, 
                    danceability: +track.features.danceability, 
                    energy: +track.features.energy , 
                    instrumentalness: +track.features.instrumentalness, 
                    speechiness: +track.features.speechiness,
                    valence: +track.features.valence,
                    tracks: [track]
                } 
                curDate = track.addedAt
                curMeans.acousticness = +track.features.acousticness
                curMeans.danceability = +track.features.danceability
                curMeans.energy = +track.features.energy 
                curMeans.instrumentalness = +track.features.instrumentalness
                curMeans.speechiness = +track.features.speechiness
                curMeans.valence = +track.features.valence
                curMeans.tracks = [track]
            } else { 
                curMeans.trackCount += 1
                curMeans.acousticness += track.features.acousticness
                curMeans.danceability += track.features.danceability
                curMeans.energy += track.features.energy 
                curMeans.instrumentalness += track.features.instrumentalness
                curMeans.speechiness += track.features.speechiness
                curMeans.valence += track.features.valence
                curMeans.tracks.push(track)
            }
        }
        return monthMeans; 
    }

    const calculateOverallMeans = (means) => { 
        const overall = { 
            trackCount: 0, 
            acousticness: 0, 
            danceability: 0, 
            energy: 0, 
            instrumentalness: 0, 
            speechiness: 0,
            valence: 0
        } 
        means.forEach(mean => { 
            overall.acousticness += mean.acousticness 
            overall.danceability += mean.danceability 
            overall.energy += mean.energy 
            overall.instrumentalness += mean.instrumentalness 
            overall.speechiness += mean.speechiness
            overall.trackCount += mean.trackCount
            overall.valence += mean.valence
        })
        console.log(overall.acousticness)
        return({
            trackCount: overall.trackCount,
            acousticness: +(overall.acousticness / means.length).toFixed(5), 
            danceability:  +(overall.danceability / means.length).toFixed(5), 
            energy:  +(overall.energy / means.length).toFixed(5), 
            instrumentalness:  +(overall.instrumentalness / means.length).toFixed(5), 
            speechiness:  +(overall.speechiness / means.length).toFixed(5),
            valence: +(overall.valence / means.length).toFixed(5)
        })
    }

    const savedTracksFeatures = async (amount) => { 
        let data = await getSavedTracks(amount) 
        const fullSavedTracks = []
        for (const trackGroup of data) { 
            let savedTracks = []
            await trackGroup.forEach((track => savedTracks.push(track.track)))
            const trackFeatures = await getTrackFeatures(savedTracks)
            //merge 
           const fullTracks = trackFeatures.tracks.map((track, index) => { 
                track.addedAt = new Date(trackGroup[index].added_at)
                track.features = trackFeatures.features[index]
                return track
           })            
           fullTracks.forEach((track) => fullSavedTracks.push(track))
        }
        fullSavedTracks.sort((track1, track2) => { 
            const date1 = track1.addedAt
            const date2 = track2.addedAt
            if(date1.getTime() < date2.getTime()) return -1
            else if(date1.getTime() > date2.getTime()) return 1
            else return 0
        }) 
        console.log("Saved tracks order : ", fullSavedTracks)
        const means = calculateTimeMeans(fullSavedTracks)
        const overallMeans = calculateOverallMeans(means)
        console.log(means)
        console.log(overallMeans)
        return ({
            overallMeans : overallMeans, 
            means: means
        })
    }

    const getUserPlaylists = async() => { 
        let playlists = await getPlaylists()
        console.log("Playlists", playlists)
        for(const playlist of playlists.items){ 
            playlist.tracks.items.forEach((track) => {
                if(track.track) track.id = track.track.id
            })
            playlist.tracks.features = await getTrackFeatures(playlist.tracks.items)
        }
        console.log("Full Playlist obj ", playlists)
        return playlists; 
    }

    return {
        savedTracksFeatures, 
        getUserPlaylists,
        calculateOverallMeans,
        getProfile
    }
}