import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Dash from "./routes/Dash";
import Game from "./routes/Game";

export default function App() {
  return (
    <GoogleOAuthProvider
      onScriptLoadError={() =>
        console.log("Unable to log in with Google right now. Script Loading failed")
      }
      clientId={process.env.REACT_APP_GOOGLE_ID!}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
