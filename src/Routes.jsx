import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import LoggingIn from "./Pages/LogginIn";

export default function RoutesPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoggingIn />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
