/* import React, { useState, useEffect, useRef } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Dropdown,
  Badge,
  Alert,
} from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToken } from "../context/useToken";
import { searchTracks } from "../helpers/musicApi";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import Logo from "../assets/images/logo.jpg";
const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loading: tokenLoading } = useToken();
  const { playSong } = useMusicPlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const lastSearchRef = useRef(""); // Para evitar búsquedas deplicadas

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdminPage = location.pathname === "/admin";

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      lastSearchRef.current = "";
      return;
    }

    if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (!token || tokenLoading) {
      return;
    }

    if (lastSearchRef.current === searchQuery) {
      return;
    }

    const timer = setTimeout(async () => {
      console.log("🔍 Buscando:", searchQuery);
      lastSearchRef.current = searchQuery;
      setIsSearching(true);
      try {
        const results = await searchTracks(token, searchQuery, 8);
        console.log("✅ Resultados:", results);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.log("❌ Error al buscar:", error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, token, tokenLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlaySong = (track) => {
    const songData = {
      title: track.name,
      artists: track.artists[0]?.name || "artista",
      album: track.album.name,
      cover: track.album.images[0]?.url,
      audio: track.preview_url,
      genre: "music",
      name: track.name,
    };
    playSong(songData);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleAddToPlaylist = (track) => {
    const playlist = JSON.parse(localStorage.getItem("userPlaylist")) || [];

    const exists = playlist.some((song) => song.name === track.name);
    if (exists) {
      alert("⚠ Esta canción ya está en tu playlist.");
      return;
    }

    const songData = {
      id: Date.now(),
      title: track.name,
      artist: track.artists[0]?.name || "artista",
      album: track.album.name,
      cover: track.album.images[0]?.url,
      audio: track.preview_url,
      genre: "music",
      name: track.name,
      duration_ms: track.duration_ms,
    };
    const updatedPlaylist = [...playlist, songData];
    localStorage.setItem("userPlaylist", JSON.stringify(updatedPlaylist));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("playlistUpdated"));
    Alert();
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Navbar expand="lg" className="py-3" style={{ backgroundColor: "#000" }}>
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
          className="text-white fw-bold logo-custom"
        >
          <img
            src={Logo}
            alt="Wavv Music Logo"
            height="75"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="text-secondary border-0"
        />

        <Navbar.Collapse id="basic-navbar-nav">
         
          <div className="ms-auto d-flex align-items-center gap-3">
            {!isAdminPage && (
              <div className="search position-relative" ref={searchRef}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"></i>
                {isSearching && (
                  <div
                    className="spinner-border spinner-border-sm position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ width: "1rem", height: "1rem" }}
                    role="status"
                  >
                    <span className="visually-hidden">Buscando...</span>
                  </div>
                )}
                <Form.Control
                  type="text"
                  className="ps-5 border-dark text-white custom-search-input"
                  placeholder="Buscar canciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "250px",
                    backgroundColor: "#1a1a1a",
                    borderColor: "#000000ff",
                    color: "#fff",
                  }}
                />

                {showDropdown && (
                  <div
                    className="search-dropdown position-absolute mt-2 rounded-3 shadow-lg"
                    style={{
                      backgroundColor: "#202026",
                      width: "400px",
                      maxHeight: "500px",
                      overflowY: "auto",
                      zIndex: 1050,
                      border: "1px solid #333",
                    }}
                  >
                    {isSearching ? (
                      <div className="p-3 text-center text-secondary">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="p-2 border-bottom border-secondary">
                          <small className="text-white-50 ms-2">
                            {searchResults.length} resultados
                          </small>
                        </div>
                        {searchResults.map((track, index) => (
                          <div
                            key={index}
                            className="search-result-item p-3 d-flex align-items-center gap-3"
                            style={{
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#2a2a30")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                            onClick={() => {
                              const songData = {
                                title: track.name,
                                artist:
                                  track.artists
                                    ?.map((a) => a.name)
                                    .join(", ") || "Unknown",
                                album: track.album?.name || "Unknown Album",
                                cover: track.album.images[0]?.url,
                                audio: track.preview_url,
                                genre: "Music",
                                name: track.name,
                              };
                              playSong(songData);
                              setShowDropdown(false);
                              setSearchQuery("");
                            }}
                          >
                            <img
                              src={
                                track.album.images[2]?.url ||
                                track.album.images[0]?.url
                              }
                              alt={track.name}
                              width="50"
                              height="50"
                              className="rounded"
                            />
                            <div className="flex-grow-1">
                              <div className="text-white fw-semibold">
                                {track.name}
                              </div>
                              <div className="text-secondary small">
                                {track.artists?.map((a) => a.name).join(", ")}
                              </div>
                            </div>
                            {track.preview_url && (
                              <i className="bx bx-play-circle fs-4 text-primary"></i>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="p-3 text-center text-secondary">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <Nav className="d-flex align-items-center gap-3">
              {isAdminPage ? (
                <NavLink
                  to="/"
                  className="text-secondary text-uppercase fw-bold nav-link-custom"
                  style={{ textDecoration: "none" }}
                >
                  <i className="bx bx-home-alt me-1"></i>
                  Home
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/playlist"
                    className="text-secondary text-uppercase fw-bold nav-link-custom"
                    style={{ textDecoration: "none" }}
                  >
                    <i className="bx bx-list-ul me-1"></i>
                    Playlist
                  </NavLink>
                  <NavLink
                    to="#"
                    className="text-secondary text-uppercase fw-bold nav-link-custom"
                    style={{ textDecoration: "none" }}
                  >
                    NOSOTROS
                  </NavLink>
                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className="text-warning text-uppercase fw-bold nav-link-custom"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="bx bx-cog me-1"></i>
                      ADMIN
                    </NavLink>
                  )}
                </>
              )}

              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  id="dropdown-user"
                  className="d-flex align-items-center profile-toggle"
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="d-flex align-items-center">
                    <div className="bg-secondary rounded-start p-1">
                      <img
                        src="assets/profile.png"
                        className="rounded"
                        width="35"
                        height="35"
                        alt="Profile"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=35&h=35&fit=crop&crop=face";
                        }}
                      />
                    </div>
                    <div className="rounded-end p-2 d-md-block">
                      <h6 className="mb-0 text-white">
                        {user?.username || "Usuario"}
                      </h6>
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="border-secondary"
                  style={{ backgroundColor: "#000", borderColor: "#000" }}
                >
                  {isAdminPage ? (
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-white d-flex align-items-center dropdown-item-custom"
                      style={{ backgroundColor: "#000" }}
                    >
                      <i className="bx bx-log-out me-2"></i>
                      <span>Cerrar Sesión</span>
                    </Dropdown.Item>
                  ) : (
                    //Vista completa para usuarios
                    <>
                      <Dropdown.Item
                        className="text-white d-flex align-items-center dropdown-item-custom"
                        style={{ backgroundColor: "#000" }}
                      >
                        <i className="bx bx-user me-2"></i>
                        <span>Perfil</span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-white d-flex align-items-center dropdown-item-custom"
                        style={{ backgroundColor: "#000" }}
                      >
                        <i className="bx bx-cog me-2"></i>
                        <span>Configuración</span>
                      </Dropdown.Item>

                      {user?.role !== "admin" && (
                        <Dropdown.Item
                          className="text-white d-flex align-items-center dropdown-item-custom"
                          style={{ backgroundColor: "#000" }}
                        >
                          <i className="bx bx-crown me-2"></i>
                          <span>Premium</span>
                          <Badge bg="warning" text="dark" className="ms-2">
                            PRO
                          </Badge>
                        </Dropdown.Item>
                      )}
                      
                      {user?.role === "admin" && (
                        <Dropdown.Item
                          onClick={() => navigate("/admin")}
                          className="text-warning d-flex align-items-center dropdown-item-custom"
                          style={{ backgroundColor: "#000" }}
                        >
                          <i className="bx bx-shield me-2"></i>
                          <span>Panel Admin</span>
                        </Dropdown.Item>
                      )}

                      <Dropdown.Divider className="border-secondary" />
                      <Dropdown.Item
                        onClick={handleLogout}
                        className="text-white d-flex align-items-center dropdown-item-custom"
                        style={{ backgroundColor: "#000" }}
                      >
                        <i className="bx bx-log-out me-2"></i>
                        <span>Cerrar Sesión</span>
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
 */

/* import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Form, Dropdown, Badge } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSongs } from "../context/SongContext"; // Usamos SongContext en lugar de Token
import { useMusicPlayer } from "../context/MusicPlayerContext";
import Logo from "../assets/images/logo.jpg";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSong } = useMusicPlayer();
  const { searchExternalSongs } = useSongs(); // Nuestra nueva función del Back

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const lastSearchRef = useRef("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdminPage = location.pathname === "/admin";

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      lastSearchRef.current = "";
      return;
    }

    if (lastSearchRef.current === searchQuery) return;

    const timer = setTimeout(async () => {
      lastSearchRef.current = searchQuery;
      setIsSearching(true);
      try {
        // Llamamos a tu Backend (iTunes API filtrada)
        const results = await searchExternalSongs(searchQuery);
        setSearchResults(results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error al buscar:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // Debounce de 400ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlaySong = (track) => {
    // Adaptamos los campos que vienen de iTunes (Backend) al Player
    const songData = {
      title: track.title,
      artist: track.artist,
      album: track.album,
      cover: track.image,
      audio: track.audio,
      name: track.title,
    };
    playSong(songData);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <Navbar expand="lg" className="py-3" style={{ backgroundColor: "#000" }}>
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={Logo} alt="Wavv Music Logo" height="75" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="text-secondary border-0"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="ms-auto d-flex align-items-center gap-3">
            {!isAdminPage && (
              <div className="search position-relative" ref={searchRef}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"></i>
                <Form.Control
                  type="text"
                  className="ps-5 border-dark text-white custom-search-input"
                  placeholder="Buscar en la red..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "250px",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                  }}
                />

                {showDropdown && (
                  <div
                    className="search-dropdown position-absolute mt-2 rounded-3 shadow-lg"
                    style={{
                      backgroundColor: "#202026",
                      width: "400px",
                      maxHeight: "450px",
                      overflowY: "auto",
                      zIndex: 1050,
                      border: "1px solid #333",
                    }}
                  >
                    {isSearching ? (
                      <div className="p-3 text-center text-secondary">
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((track, index) => (
                        <div
                          key={index}
                          className="search-result-item p-3 d-flex align-items-center gap-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handlePlaySong(track)}
                        >
                          <img
                            src={track.image}
                            alt={track.title}
                            width="50"
                            height="50"
                            className="rounded"
                          />
                          <div className="flex-grow-1">
                            <div className="text-white fw-semibold">
                              {track.title}
                            </div>
                            <div className="text-secondary small">
                              {track.artist}
                            </div>
                          </div>
                          <i className="bx bx-play-circle fs-4 text-primary"></i>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-secondary">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Nav className="d-flex align-items-center gap-3">
              <NavLink
                to="/playlist"
                className="text-secondary text-uppercase fw-bold nav-link-custom"
              >
                Playlist
              </NavLink>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className="text-warning text-uppercase fw-bold nav-link-custom"
                >
                  ADMIN
                </NavLink>
              )}

              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  className="d-flex align-items-center profile-toggle"
                  style={{ backgroundColor: "transparent" }}
                >
                  <h6 className="mb-0 text-white">
                    {user?.username || "Usuario"}
                  </h6>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="border-secondary"
                  style={{ backgroundColor: "#000" }}
                >
                  <Dropdown.Item onClick={handleLogout} className="text-white">
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar; */

import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Form, Dropdown, Badge } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSongs } from "../context/SongContext"; // Nueva lógica
import { useMusicPlayer } from "../context/MusicPlayerContext";
import Logo from "../assets/images/logo.jpg";
import { toast, Slide } from "react-toastify";
import { showConfirm } from "../helpers/alerts";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSong } = useMusicPlayer();
  const { searchExternalSongs } = useSongs(); // Consumimos la nueva API del Backend

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const lastSearchRef = useRef("");

  const handleLogout = async () => {
    const result = await showConfirm(
      "¿Estás seguro que deseas cerrar sesión?",
      "Cerrar Sesión",
    );

    if (result.isConfirmed) {
      logout();
      navigate("/login");
    }
  };

  const isAdminPage = location.pathname === "/admin";

  // Lógica de búsqueda actualizada a la nueva API
  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      lastSearchRef.current = "";
      return;
    }

    if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (lastSearchRef.current === searchQuery) return;

    const timer = setTimeout(async () => {
      lastSearchRef.current = searchQuery;
      setIsSearching(true);
      try {
        // Usamos la nueva función que definimos en el SongContext
        const results = await searchExternalSongs(searchQuery);
        setSearchResults(results || []);
        setShowDropdown(true);
      } catch (error) {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlaySong = (track) => {
    // Adaptamos los campos de la nueva API (Backend/iTunes) al reproductor
    const songData = {
      title: track.title,
      artist: track.artist,
      album: track.album,
      cover: track.image,
      audio: track.audio,
      name: track.title,
    };
    playSong(songData);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <Navbar
      expand="lg"
      className="py-2"
      fixed="top"
      style={{ backgroundColor: "#000", zIndex: 1030 }}
    >
      <Container fluid className="position-relative">
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
          className="text-white fw-bold logo-custom"
        >
          <img
            src={Logo}
            alt="Wavv Music Logo"
            height="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {!isAdminPage && (
              <NavLink
                to="/playlist"
                className="text-secondary text-uppercase fw-bold nav-link-custom"
                style={{ textDecoration: "none" }}
              >
                Playlist
              </NavLink>
            )}

            {!isAdminPage && (
              <NavLink
                to="/about-us"
                className="text-secondary text-uppercase fw-bold nav-link-custom"
                style={{ textDecoration: "none" }}
              >
                Nosotros
              </NavLink>
            )}

            {isAdminPage && (
              <NavLink
                to="/"
                className="text-secondary text-uppercase fw-bold nav-link-custom"
                style={{ textDecoration: "none" }}
              >
                <i className="bx bx-home-alt me-1"></i>
                Home
              </NavLink>
            )}

            {!isAdminPage && (
              <div
                className="search position-relative"
                ref={searchRef}
                style={{ maxWidth: "250px", width: "100%" }}
              >
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"></i>
                {isSearching && (
                  <div
                    className="spinner-border spinner-border-sm position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ width: "1rem", height: "1rem" }}
                    role="status"
                  >
                    <span className="visually-hidden">Buscando...</span>
                  </div>
                )}
                <Form.Control
                  type="text"
                  className="ps-5 border-dark text-white custom-search-input w-100"
                  placeholder="Buscar canciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#000000ff",
                    color: "#fff",
                  }}
                />

                {showDropdown && (
                  <div
                    className="search-dropdown position-absolute mt-2 rounded-3 shadow-lg"
                    style={{
                      backgroundColor: "#202026",
                      width: "100%",
                      minWidth: "300px",
                      maxWidth: "400px",
                      maxHeight: "500px",
                      overflowY: "auto",
                      zIndex: 1050,
                      border: "1px solid #333",
                      left: 0,
                    }}
                  >
                    {isSearching ? (
                      <div className="p-3 text-center text-secondary">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="p-2 border-bottom border-secondary">
                          <small className="text-white-50 ms-2">
                            {searchResults.length} resultados
                          </small>
                        </div>
                        {searchResults.map((track, index) => (
                          <div
                            key={index}
                            className="search-result-item p-3 d-flex align-items-center gap-3"
                            style={{
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(event) =>
                              (event.currentTarget.style.backgroundColor =
                                "#2a2a30")
                            }
                            onMouseLeave={(event) =>
                              (event.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                            onClick={() => handlePlaySong(track)}
                          >
                            <img
                              src={track.image}
                              alt={track.title}
                              width="50"
                              height="50"
                              className="rounded"
                            />
                            <div className="flex-grow-1">
                              <div className="text-white fw-semibold">
                                {track.title}
                              </div>
                              <div className="text-secondary small">
                                {track.artist}
                              </div>
                            </div>
                            {track.audio && (
                              <i className="bx bx-play-circle fs-4 text-primary"></i>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="p-3 text-center text-secondary">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Dropdown align="end" drop="down" className="user-dropdown">
              <Dropdown.Toggle
                as="div"
                id="dropdown-user"
                className="d-flex align-items-center profile-toggle"
                style={{ backgroundColor: "transparent", cursor: "pointer" }}
              >
                <div className="d-flex align-items-center">
                  <div className="bg-secondary rounded-start p-1">
                    <img
                      src="assets/images/juan.png"
                      className="rounded"
                      width="35"
                      height="35"
                      alt="Profile"
                      onError={(event) => {
                        event.target.src =
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=35&h=35&fit=crop&crop=face";
                      }}
                    />
                  </div>
                  <div className="rounded-end p-2 d-md-block">
                    <h6 className="mb-0 text-white">
                      {user?.username || "Usuario"}
                    </h6>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="border-secondary user-dropdown-menu"
                renderOnMount
                style={{ backgroundColor: "#000", borderColor: "#000" }}
              >
                <Dropdown.Item
                  onClick={handleLogout}
                  className="text-white d-flex align-items-center dropdown-item-custom"
                  style={{ backgroundColor: "#000" }}
                >
                  <i className="bx bx-log-out me-2"></i>
                  <span>Cerrar Sesión</span>
                </Dropdown.Item>
                {user?.role === "admin" && !isAdminPage && (
                  <Dropdown.Item
                    onClick={() => navigate("/admin")}
                    className="text-warning d-flex align-items-center dropdown-item-custom"
                    style={{ backgroundColor: "#000" }}
                  >
                    <i className="bx bx-shield me-2"></i>
                    <span>Panel Admin</span>
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
