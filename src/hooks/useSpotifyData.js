
export default function useSpotifyData(access_token, token_type){ 
    
    const getContent = (path, query="", body, method = 'get') => { 
        return new Promise(function(fufill, reject) { 
            const fullQuery = 'https://api.spotify.com/v1'+path+query
            const item = sessionStorage.getItem(fullQuery)
            if(item) fufill(JSON.parse(item))
            //else fetch it 
            else fetch(new Request(fullQuery, {
                method: method, 
                body: body
              }), {
                headers: {
                 Authorization: `${token_type} ${access_token}`, 
            }, 
            })
            .then((response) => { 
                if(response.ok) response.json().then(data => {
                    sessionStorage.setItem(fullQuery, JSON.stringify(data))
                    fufill(data)
                })
                else throw new Error(`Request error code ${response.status}`)
            })
            .catch(err => reject(err))
        })
    }

    const getProfile = () => { 
        return new Promise(function(fufill, reject){
            try { 
                getContent(("/me"))
                .then((data) => { 
                    fufill(data)
               })
            } catch(err) { 
                reject(err)
            }
        })
    }

    const getTrackFeatures = (tracks) => { 
        return new Promise(function(fufill, reject){
            let tracksId = "?ids="
            for(const track of tracks) { 
                tracksId += track.id + ","
            }
            getContent("/audio-features", tracksId)
            .then((data) => { 
                fufill({
                    tracks, 
                    features: data.audio_features
                })
            })
            .catch(err => reject(err))
        })
    }
    
    const getTopTracks = () => { 
        return new Promise(function(fufill, reject){
            try { 
                getContent(("/me/top/tracks"))
                .then((data) => { 
                    const tracks = data.items 
                    getTrackFeatures(tracks).then(data => fufill(data))
               })
            } catch(err) { 
                reject(err)
            }
        })
    }

    const getSavedTracks = (amount = 50) => { 
        return new Promise(function(fufill, reject){ 
            try { 
                let calls = Math.ceil(amount/50)
                const tracks = [] 
                const fetches = []
                for (let i = 0; i < calls; i++){ 
                    fetches.push(
                        getContent(("/me/tracks"),`?limit=50&offset=${i*50}`)
                        .then((data) => { 
                            tracks.push(data.items)
                        })
                    )
                }
                Promise.all(fetches).then(() => {
                    fufill(tracks)
                })
            } catch(err) { reject(err) } 
        })
    }

    const getPlaylists = () => { 
        return new Promise(function(fufill, reject){
            try {
                const fetches = []
                getContent(("/me/playlists"))
                .then((userPlaylists) => { 
                    for(const playlist of userPlaylists.items){
                        fetches.push(
                            getContent(`/playlists/${playlist.id}/tracks`)
                            .then((tracks) => { 
                                playlist.tracks = tracks
                            })
                        )
                    }
                    Promise.all(fetches).then(() => fufill(userPlaylists))
                })
            } catch (err) { 
                reject(err)
            }
        })
    }

    return {
        getProfile,
        getTopTracks,
        getTrackFeatures,  
        getSavedTracks, 
        getPlaylists
    }
}