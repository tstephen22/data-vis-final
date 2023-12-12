
export default function useSpotifyData(access_token, token_type){ 

    const getContent = (path, callback, query="", body, method = 'get') => { 
        console.log(`Fetching with access token\n${access_token}\nToken Type : ${token_type}`)
        fetch(new Request('https://api.spotify.com/v1'+path+query, {
            method: method, 
            body: body
          }), {
            headers: {
             Authorization: `${token_type} ${access_token}`, 
        }, 
        })
        .then((response) => { 
            if(response.ok) response.json().then(data => callback(data))
            else throw new Error(`Request error code ${response.status}`)
        })
        .catch(err => console.error(err))
    }

    const getProfileDetails = () => { 
        return new Promise(function(fufill, reject){
            try { 
                getContent(("/me"), (data) => { 
                    fufill(data)
               })
            } catch(err) { 
                reject(err)
            }
        })
    }
    
    const getTopTracks = () => { 
        return new Promise(function(fufill, reject){
            try { 
                getContent(("/me/top/tracks"), (data) => { 
                    const tracks = data.items 
                    let tracksId = "?ids="
                    for(const track of tracks) { 
                        tracksId += track.id + ","
                    }
                    getContent("/audio-features", (data) => { 
                        fufill({
                            tracks, 
                            tracksFeatures: data
                        })
                    }, tracksId)
               })
            } catch(err) { 
                reject(err)
            }
        })
    }
    return {
        getProfileDetails,
        getTopTracks
    }
}