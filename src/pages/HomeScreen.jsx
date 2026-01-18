import React, { useState, useEffect } from "react";
import ArtistasSidebar from "../components/ArtistasSidebar";
import MusicPlayer from "../components/MusicPlayer";
import TrendingSong from "../components/TrendingSong";
import TopSongs from "../components/TopSongs";
import { useSongs } from "../context/SongContext";

const HomeScreen = () => {
  // Estado para el álbum seleccionado (se mantiene tu lógica original)
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  
  // Obtenemos las canciones y la función para pedirlas desde el contexto
  const { songs, getSongs } = useSongs();

  useEffect(() => {
    // Al cargar el Home, le pedimos al backend las canciones de MongoDB
    getSongs();
  }, []);
  return (
    <div className="d-flex">
      <ArtistasSidebar onAlbumSelect={setSelectedAlbum} />
      <div className="mx-auto">
        <TrendingSong song={songs[0]}/>
        <TopSongs album={selectedAlbum} fromHome={true} songs={songs}/>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default HomeScreen;
