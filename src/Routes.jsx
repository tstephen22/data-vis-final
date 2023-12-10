import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import SpotifyLogin from "./Pages/SpotifyLogin";
import Redirect from "./Pages/Redirect";
import ProfilePage from "./Pages/Profile";

export default function RoutesPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="spotify-login" element={<SpotifyLogin/>} /> 
          <Route path="redirect" element={<Redirect />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
