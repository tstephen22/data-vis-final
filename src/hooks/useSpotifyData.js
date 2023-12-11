
export default function useSpotifyData(access_token, token_type){ 

    const getContent = (path, callback, body) => { 
        fetch('https://api.spotify.com/v1'+path, {
            headers: {
            Authorization: `${token_type} ${access_token}`
        }})
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
                    const tracksFull = [] 
                    tracks.forEach((track) => { 

                    })
               })
            } catch(err) { 
                reject(err)
            }
        })
    }
}