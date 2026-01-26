/* import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import UsersSection from "./components/UsersSection";
import SongsSection from "./components/SongsSection";
import ArtistsSection from "./components/ArtistsSection";

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [savedArtists, setSavedArtists] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storedSongs = JSON.parse(localStorage.getItem("songs")) || [];
      const storedAlbums = JSON.parse(localStorage.getItem("albums")) || [];
      const storedArtists = JSON.parse(localStorage.getItem("artistas")) || [];

      setUsers(storedUsers);
      setSongs(storedSongs);
      setAlbums(storedAlbums);
      setSavedArtists(storedArtists);
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  return (
    <>
      <NavBar />
      <Container className="py-5">
        <UsersSection users={users} setUsers={setUsers} />
        <SongsSection songs={songs} setSongs={setSongs} />
        <ArtistsSection
          albums={albums}
          setAlbums={setAlbums}
          savedArtists={savedArtists}
          setSavedArtists={setSavedArtists}
        />
      </Container>
    </>
  );
};

export default AdminScreen;
 */

import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import SongsSection from "./components/SongsSection";
import ArtistsSection from "./components/ArtistsSection";
import { useSongs } from "../../context/SongContext";

const AdminScreen = () => {
  const { songs, getSongs } = useSongs();

  useEffect(() => {
    getSongs(); // Trae las canciones de MongoDB Atlas
  }, []);

  return (
    <div className="bg-black min-vh-100">
      <NavBar />
      <Container className="py-5">
        <h2 className="text-white mb-4">Panel de Control</h2>
        {/* Pasamos las canciones reales del backend */}
        <SongsSection songs={songs} />
        <ArtistsSection
          albums={[]}
          setAlbums={() => {}}
          savedArtists={[]}
          setSavedArtists={() => {}}
        />
      </Container>
    </div>
  );
};

export default AdminScreen;
