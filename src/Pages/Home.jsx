import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function Home() { 
    const navigate = useNavigate(); 

    const logIn = () => { 
        console.log("User pressed logged in."); 
        navigate("/spotify-login");
    }
    return(
        <div>
            <Button variant="outlined" className="login" onClick={logIn}>
                Login
            </Button> 
        </div>
    )
}