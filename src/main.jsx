import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import "./index.css";
import App from "./App.jsx";


import { AuthProvider } from "./context/AuthContext.jsx";
import { MusicPlayerProvider } from "./context/MusicPlayerContext.jsx";
import { SongProvider } from "./context/SongContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SongProvider>
        <MusicPlayerProvider>
          <App />
        </MusicPlayerProvider>
      </SongProvider>
    </AuthProvider>
  </StrictMode>,
);
