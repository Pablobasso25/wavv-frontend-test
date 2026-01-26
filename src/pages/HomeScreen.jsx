import React, { useState, useEffect } from "react";
import ArtistasSidebar from "../components/ArtistasSidebar";
import MusicPlayer from "../components/MusicPlayer";
import TrendingSong from "../components/TrendingSong";
import TopSongs from "../components/TopSongs";
import { useSongs } from "../context/SongContext";

const HomeScreen = () => {
  // Estado para el álbum seleccionado (se mantiene la lógica original)
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Obtenemos las canciones y la función para pedirlas desde el contexto
  const { songs, getSongs } = useSongs();

  useEffect(() => {
    // Al cargar el Home, le pedimos al backend las canciones de MongoDB
    getSongs();
  }, []);

  // Mapeamos las canciones de la DB para que el Sidebar las pueda mostrar como "artistas"
  const artistsFromDB = songs.map((song) => ({
    id: song._id,
    name: song.artist,
    image: song.image,
    album: {
      name: song.title,
      image: song.image,
      tracks: [{ name: song.title, audio: song.youtubeUrl, cover: song.image }],
    },
  }));
  return (
    <div className="d-flex">
      <ArtistasSidebar
        artistas={artistsFromDB}
        onAlbumSelect={setSelectedAlbum}
      />
      <div className="mx-auto">
        {songs.length > 0 && <TrendingSong song={songs[0]} />}
        <TopSongs album={selectedAlbum} fromHome={true} />
      </div>
      <MusicPlayer />
    </div>
  );
};

export default HomeScreen;
