/* import { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useToken } from "../../../context/useToken";
import { searchArtistAndAlbums } from "../../../helpers/musicApi";
import AlbumTable from "./AlbumTable";

const ArtistsSection = ({
  albums,
  setAlbums,
  savedArtists,
  setSavedArtists,
}) => {

  const { token } = useToken();
  const [artistName, setArtistName] = useState("");


  const handleSearchAndSaveArtist = async () => {

    if (!artistName.trim()) {
      alert("⚠️ Ingresá un nombre de artista válido.");
      return;
    }

    const result = await searchArtistAndAlbums(token, artistName);

    if (!result || !result.artist || !result.album) {
      alert("❌ Artista o álbum no encontrado.");
      return;
    }

    const yaExiste = savedArtists.some((a) => a.id === result.artist.id);
    if (yaExiste) {
      alert("⚠️ Este artista ya fue guardado.");
      return;
    }

    const artistaConAlbum = {
      ...result.artist,
      album: result.album,
    };

    const updatedArtists = [...savedArtists, artistaConAlbum];
    setSavedArtists(updatedArtists);
    localStorage.setItem("artistas", JSON.stringify(updatedArtists));

    const updatedAlbums = [...albums, result.album];
    setAlbums(updatedAlbums);
    localStorage.setItem("albums", JSON.stringify(updatedAlbums));

    setArtistName("");
    alert(`✅ Artista "${result.artist.name}" guardado correctamente.`);
  };

  const handleDeleteAlbum = (albumId) => {
    if (!confirm("¿Estás seguro de eliminar este álbum?")) {
      return;
    }

    const updatedAlbums = albums.filter((album) => album.id !== albumId);
    setAlbums(updatedAlbums);
    localStorage.setItem("albums", JSON.stringify(updatedAlbums));


    const updatedArtists = savedArtists.filter(
      (artist) => artist.album.id !== albumId
    );
    setSavedArtists(updatedArtists);
    localStorage.setItem("artistas", JSON.stringify(updatedArtists));


    window.dispatchEvent(new Event("storage"));

    alert("✅ Álbum eliminado correctamente.");
  };


  return (
    <>
      <Row className="mb-4">
        <Col md={12}>
          <Card className="bg-dark text-white border-secondary">
            <Card.Body>
              <h4 className="mb-3">Buscar y guardar artista desde Spotify</h4>
              <Form>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del artista</Form.Label>
                      <Form.Control
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="Ej: Bad Bunny, Taylor Swift, The Weeknd..."
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      variant="warning"
                      onClick={handleSearchAndSaveArtist}
                      className="mb-3 w-100"
                    >
                       Buscar y Guardar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <AlbumTable albums={albums} onDelete={handleDeleteAlbum} />
        </Col>
      </Row>
    </>
  );
};

export default ArtistsSection; */

import { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "../../../api/axios";
import AlbumTable from "./AlbumTable";

const ArtistsSection = ({
  albums,
  setAlbums,
  savedArtists,
  setSavedArtists,
}) => {
  const [artistName, setArtistName] = useState("");

  const handleSearchAndSaveArtist = async () => {
    if (!artistName.trim()) {
      alert("⚠️ Ingresá un nombre de artista válido.");
      return;
    }

    try {
      // Usamos tu nueva ruta del backend
      const res = await axios.get(`/search-external?search=${artistName}`);
      const results = res.data;

      if (!results || results.length === 0) {
        alert("❌ No se encontraron resultados.");
        return;
      }

      const firstResult = results[0];

      const newAlbum = {
        id: firstResult.id.toString(),
        name: firstResult.album || firstResult.title,
        image: firstResult.image,
        artists: [{ name: firstResult.artist }],
        tracks: results.map((track) => ({
          name: track.title,
          preview_url: track.audio,
          duration_ms: track.duration_ms,
          cover: track.image,
        })),
      };

      // Actualizamos el estado de la aplicación, pero ya no tocamos localStorage
      setSavedArtists([
        ...savedArtists,
        { name: firstResult.artist, image: firstResult.image, album: newAlbum },
      ]);
      setAlbums([...albums, newAlbum]);
      setArtistName("");

      alert(`✅ Artista "${firstResult.artist}" cargado en la sesión.`);
    } catch (error) {
      console.error("Error al buscar:", error);
      alert("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={12}>
          <Card className="bg-dark text-white border-secondary">
            <Card.Body>
              <h4 className="mb-3">Buscar Artista (iTunes API via Backend)</h4>
              <Form>
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Ej: Bad Bunny, Duki..."
                    />
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="warning"
                      onClick={handleSearchAndSaveArtist}
                      className="w-100"
                    >
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AlbumTable albums={albums} />
    </>
  );
};

export default ArtistsSection;
