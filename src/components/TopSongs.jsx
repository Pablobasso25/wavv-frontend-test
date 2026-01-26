/* import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
//import trendImg from "../assets/trend.png"; // Agregar imagen cuando exista
import { useMusicPlayer } from "../context/MusicPlayerContext";

const TopSongs = ({ album, isPlaylist = false, fromHome = false }) => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const loadPlaylist = () => {
      const storedPlaylist =
        JSON.parse(localStorage.getItem("userPlaylist")) || [];
      setPlaylist(storedPlaylist);
    };

    loadPlaylist();

    window.addEventListener("storage", loadPlaylist);
    const customListener = () => loadPlaylist();
    window.addEventListener("playlistUpdated", customListener);

    return () => {
      window.removeEventListener("storage", loadPlaylist);
      window.removeEventListener("playlistUpdated", customListener);
    };
  }, []);

  const handleAddToPlaylist = (track) => {
    const songData = {
      id: Date.now(),
      title: track.name,
      artist: album.artists?.[0]?.name || "Artista",
      album: album.name,
      cover: album.image,
      audio: track.preview_url,
      genre: "Music",
      name: track.name,
      duration_ms: track.duration_ms,
    };

    const exists = playlist.some(
      (song) => song.name === track.name && song.album === album.name
    );

    if (exists) {
      alert(`⚠️ Esta canción ya está en tu playlist.`);
      return;
    }

    const updatedPlaylist = [...playlist, songData];
    setPlaylist(updatedPlaylist);
    localStorage.setItem("userPlaylist", JSON.stringify(updatedPlaylist));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("playlistUpdated"));
    alert(`✅ "${track.name}" agregada a tu playlist.`);
  };

  const handleRemoveFromPlaylist = (track) => {
    if (!confirm(`¿Eliminar "${track.name}" de tu playlist?`)) {
      return;
    }

    const updatedPlaylist = playlist.filter(
      (song) => !(song.name === track.name && song.album === track.album)
    );

    setPlaylist(updatedPlaylist);
    localStorage.setItem("userPlaylist", JSON.stringify(updatedPlaylist));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("playlistUpdated"));
    alert(`✅ "${track.name}" eliminada de tu playlist.`);
  };

  const isInPlaylist = (trackName) => {
    return playlist.some(
      (song) => song.name === trackName && song.album === album.name
    );
  };

  if (!album || !album.tracks || album.tracks.length === 0) {
    return (
      <Col xs={12}>
        <div className="music-list bg-dark text-white rounded p-3 h-100">
          <h5>⚠️ No hay canciones disponibles</h5>
          <p className="text-secondary">
            Seleccioná un artista del sidebar o agregá uno desde el panel de
            administración.
          </p>
        </div>
      </Col>
    );
  }

  return (
    <Container style={{ width: "60vw" }}>
      <div
        className="music-list p-3 rounded-4"
        style={{
          backgroundColor: "#111111",
          height: fromHome ? "calc(80vh - 280px)" : "80vh",
          overflowY: "auto",
        }}
      >
        <div className="header d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Canciones de {album.name}</h5>
          <span className="text-secondary small">{album.release_date}</span>
        </div>

        <div className="items">
          {album.tracks.map((track, index) => {
            const isCurrentTrack = currentSong?.name === track.name;

            return (
              <div
                key={index}
                className="item d-flex align-items-center justify-content-between p-3 rounded-3 mb-2 cursor-pointer"
                style={{
                  backgroundColor: "#191B1B",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#35393B")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#191B1B")
                }
                onClick={() => {
                  const songData = {
                    title: track.name,
                    artist: album.artists?.[0]?.name || "Artista",
                    album: album.name,
                    cover: track.cover || album.image,
                    audio: track.preview_url,
                    genre: "Music",
                    name: track.name,
                  };
                  playSong(songData);
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold" style={{ minWidth: "30px" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <img
                    src={track.cover || album.image}
                    className="rounded me-2 me-md-3"
                    width="40"
                    height="40"
                    alt={track.name}
                  />

                  <div className="details">
                    <h6
                      className="mb-0 small"
                      style={{
                        color: isCurrentTrack ? "#0d6efd" : "white",
                      }}
                    >
                      {track.name}
                    </h6>
                  </div>
                </div>

                <div className="actions d-flex align-items-center gap-3">
                  {track.preview_url && (
                    <i
                      className={`bx ${
                        isCurrentTrack && isPlaying ? "bx-pause" : "bx-play"
                      } cursor-pointer fs-2`}
                      title={
                        isCurrentTrack && isPlaying ? "Pausar" : "Reproducir"
                      }
                    ></i>
                  )}

                  {isPlaylist ? (
                    <i
                      className="bx bxs-trash text-danger fs-4"
                      style={{ cursor: "pointer" }}
                      title="Eliminar de playlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromPlaylist(track);
                      }}
                    ></i>
                  ) : (
                    <i
                      className={`bx ${
                        isInPlaylist(track.name)
                          ? "bxs-check-circle text-success"
                          : "bxs-plus-square text-secondary"
                      } fs-4`}
                      style={{ cursor: "pointer" }}
                      title={
                        isInPlaylist(track.name)
                          ? "Ya está en tu playlist"
                          : "Agregar a playlist"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        !isInPlaylist(track.name) && handleAddToPlaylist(track);
                      }}
                    ></i>
                  )}

                  <span style={{ color: "#494D4E" }}>
                    {track.duration_ms
                      ? Math.floor(track.duration_ms / 1000 / 60) +
                        ":" +
                        String(
                          Math.floor((track.duration_ms / 1000) % 60)
                        ).padStart(2, "0")
                      : "0:00"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default TopSongs; */

/* import React from "react";
import { Container } from "react-bootstrap";
import { useMusicPlayer } from "../context/MusicPlayerContext";

const TopSongs = ({ album, fromHome = false }) => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();

  if (!album || !album.tracks)
    return (
      <div className="text-white p-3">
        Seleccioná un álbum para ver las canciones.
      </div>
    );

  return (
    <Container style={{ width: "60vw" }}>
      <div
        className="p-3 rounded-4"
        style={{
          backgroundColor: "#111",
          height: fromHome ? "calc(80vh - 280px)" : "80vh",
          overflowY: "auto",
        }}
      >
        <h5 className="text-white mb-4">Canciones de {album.name}</h5>
        {album.tracks.map((track, index) => {
          const isCurrent = currentSong?.name === track.name;
          return (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between p-3 mb-2 rounded"
              style={{ backgroundColor: "#191B1B", cursor: "pointer" }}
              onClick={() =>
                playSong({
                  title: track.name,
                  artist: album.artists?.[0]?.name || "Artista",
                  album: album.name,
                  cover: track.cover || album.image,
                  audio: track.preview_url || track.audio, // Soporta tu nuevo formato
                  name: track.name,
                })
              }
            >
              <div className="d-flex align-items-center gap-3">
                <span className="text-secondary">{index + 1}</span>
                <img
                  src={track.cover || album.image}
                  width="40"
                  height="40"
                  className="rounded"
                  alt=""
                />
                <span style={{ color: isCurrent ? "#0d6efd" : "white" }}>
                  {track.name}
                </span>
              </div>
              <i
                className={`bx ${isCurrent && isPlaying ? "bx-pause" : "bx-play"} fs-3 text-white`}
              ></i>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default TopSongs;
 */

/*import  React from "react";
import { Container, Col } from "react-bootstrap";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import { useSongs } from "../context/SongContext"; // Importar el contexto de canciones
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const TopSongs = ({ album, fromHome = false }) => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
const { addSongToPlaylist } = useSongs(); // Traemos la función
  const navigate = useNavigate();

// Función para manejar el guardado en la base de datos
  const handleAddClick = async (e, trackId) => {
    e.stopPropagation(); // Detiene el click para que NO se reproduzca la canción
    
    const result = await addSongToPlaylist(trackId);

    if (result.success) {
      Swal.fire({ 
        icon: "success", 
        title: "Añadido a tu Playlist", 
        timer: 1500, 
        showConfirmButton: false, 
        background: "#111", 
        color: "#fff" 
      });
    } else if (result.status === 403 && result.code === "PREMIUM_REQUIRED") {
      // Si el backend nos rebota por el límite de 5 canciones:
      Swal.fire({
        title: "¡Pasáte a Premium!",
        text: "Alcanzaste el límite de 5 canciones gratis. Suscríbete para tener playlist ilimitada.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ver Suscripciones",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#6f42c1",
        background: "#111",
        color: "#fff"
      }).then((res) => {
        if (res.isConfirmed) navigate("/subscriptions");
      });
    }
  };
  if (!album || !album.tracks || album.tracks.length === 0) {
    return (
      <Col xs={12}>
        <div className="music-list bg-dark text-white rounded p-3 h-100">
          <h5>⚠️ No hay canciones disponibles</h5>
          <p className="text-secondary">
            Seleccioná un artista para ver sus canciones.
          </p>
        </div>
      </Col>
    );
  }

  return (
    <Container fluid className="px-2 px-lg-3">
      <div
        className="music-list p-3 rounded-4"
        style={{
          backgroundColor: "#111111",
          height: fromHome ? "auto" : "80vh",
          minHeight: fromHome ? "400px" : "auto",
          maxHeight: fromHome ? "calc(100vh - 350px)" : "80vh",
          overflowY: "auto",
        }}
      >
        <div className="header d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-white">Canciones de {album.name}</h5>
          <span className="text-secondary small">
            {album.release_date || "2026"}
          </span>
        </div>

        <div className="items">
          {album.tracks.map((track, index) => {
            const isCurrentTrack = currentSong?.name === track.name;

            return (
              <div
                key={index}
                className="item d-flex align-items-center justify-content-between p-3 rounded-3 mb-2 cursor-pointer"
                style={{
                  backgroundColor: "#191B1B",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#35393B")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#191B1B")
                }
                onClick={() => {
                  playSong({
                    title: track.name,
                    artist: album.artists?.[0]?.name || "Artista",
                    album: album.name,
                    cover: track.cover || album.image,
                    audio: track.preview_url || track.audio, // Lógica nueva: soporta preview_url o audio
                    name: track.name,
                  });
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="fw-bold text-white"
                    style={{ minWidth: "30px" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <img
                    src={track.cover || album.image}
                    className="rounded me-2 me-md-3"
                    width="40"
                    height="40"
                    alt={track.name}
                  />

                  <div className="details">
                    <h6
                      className="mb-0 small"
                      style={{
                        color: isCurrentTrack ? "#0d6efd" : "white",
                      }}
                    >
                      {track.name}
                    </h6>
                  </div>
                </div>

                <div className="actions d-flex align-items-center gap-3">
                  <i
                    className={`bx ${
                      isCurrentTrack && isPlaying ? "bx-pause" : "bx-play"
                    } cursor-pointer fs-2 text-white`}
                  ></i>

                  <span style={{ color: "#494D4E" }}>
                    {track.duration_ms
                      ? Math.floor(track.duration_ms / 1000 / 60) +
                        ":" +
                        String(
                          Math.floor((track.duration_ms / 1000) % 60),
                        ).padStart(2, "0")
                      : "0:30"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default TopSongs; */

import React from "react";
import { Container, Col } from "react-bootstrap";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import { useSongs } from "../context/SongContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TopSongs = ({ album, fromHome = false }) => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const { addSongToPlaylist } = useSongs();
  const navigate = useNavigate();

  // Función para manejar el guardado en la base de datos
  const handleAddClick = async (e, trackId) => {
    e.stopPropagation(); // Detiene el click para que NO se reproduzca la canción

    const result = await addSongToPlaylist(trackId);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Añadido a tu Playlist",
        timer: 1500,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
    } else if (result.status === 403 && result.code === "PREMIUM_REQUIRED") {
      // Si el backend nos rebota por el límite de 5 canciones:
      Swal.fire({
        title: "⭐ ¡Pásate a Premium!",
        text: "Alcanzaste el límite de 5 canciones gratis. Suscríbete para tener playlist ilimitada.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ver Suscripciones",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#6f42c1",
        background: "#111",
        color: "#fff",
      }).then((res) => {
        if (res.isConfirmed) navigate("/subscriptions");
      });
    }
  };

  if (!album || !album.tracks || album.tracks.length === 0) {
    return (
      <Col xs={12}>
        <div className="music-list bg-dark text-white rounded p-3 h-100">
          <h5>⚠️ No hay canciones disponibles</h5>
          <p className="text-secondary">
            Seleccioná un artista para ver sus canciones.
          </p>
        </div>
      </Col>
    );
  }

  return (
    <Container fluid className="px-2 px-lg-3">
      <div
        className="music-list p-3 rounded-4"
        style={{
          backgroundColor: "#111111",
          height: fromHome ? "auto" : "80vh",
          minHeight: fromHome ? "400px" : "auto",
          maxHeight: fromHome ? "calc(100vh - 350px)" : "80vh",
          overflowY: "auto",
        }}
      >
        <div className="header d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-white">Canciones de {album.name}</h5>
          <span className="text-secondary small">
            {album.release_date || "2026"}
          </span>
        </div>

        <div className="items">
          {album.tracks.map((track, index) => {
            const isCurrentTrack = currentSong?.name === track.name;

            return (
              <div
                key={index}
                className="item d-flex align-items-center justify-content-between p-3 rounded-3 mb-2 cursor-pointer"
                style={{
                  backgroundColor: "#191B1B",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#35393B")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#191B1B")
                }
                onClick={() => {
                  playSong({
                    title: track.name,
                    artist: album.artists?.[0]?.name || "Artista",
                    album: album.name,
                    cover: track.cover || album.image,
                    audio: track.preview_url || track.audio,
                    name: track.name,
                  });
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="fw-bold text-white"
                    style={{ minWidth: "30px" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <img
                    src={track.cover || album.image}
                    className="rounded"
                    width="40"
                    height="40"
                    alt={track.name}
                  />
                  <div className="details">
                    <h6
                      className="mb-0 small"
                      style={{ color: isCurrentTrack ? "#0d6efd" : "white" }}
                    >
                      {track.name}
                    </h6>
                  </div>
                </div>

                <div className="actions d-flex align-items-center gap-3">
                  {/* ICONO DE AGREGAR (+) */}
                  <i
                    className="bx bxs-plus-square text-secondary fs-4"
                    style={{ cursor: "pointer" }}
                    title="Agregar a mi playlist"
                    onClick={(e) => handleAddClick(e, track._id || track.id)}
                  ></i>

                  <i
                    className={`bx ${isCurrentTrack && isPlaying ? "bx-pause" : "bx-play"} fs-2 text-white`}
                  ></i>

                  <span style={{ color: "#494D4E" }}>
                    {track.duration_ms
                      ? Math.floor(track.duration_ms / 1000 / 60) +
                        ":" +
                        String(
                          Math.floor((track.duration_ms / 1000) % 60),
                        ).padStart(2, "0")
                      : "0:30"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default TopSongs;
