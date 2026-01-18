import React, { createContext, useContext, useState } from "react";
import { getSongsRequest, createSongRequest } from "../api/songs";

const SongContext = createContext();

export const useSongs = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSongs debe usarse dentro de SongProvider");
  return context;
};

export function SongProvider({ children }) {
  const [songs, setSongs] = useState([]);

  const getSongs = async () => {
    try {
      const res = await getSongsRequest();
      setSongs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createSong = async (song) => {
    try {
      const res = await createSongRequest(song);
      setSongs([...songs, res.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SongContext.Provider value={{ songs, getSongs, createSong }}>
      {children}
    </SongContext.Provider>
  );
}
