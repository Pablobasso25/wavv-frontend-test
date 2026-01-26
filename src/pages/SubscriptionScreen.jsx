import React, { useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const SubscriptionScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      // 1. Llamamos al backend para crear la preferencia de Mercado Pago
      const res = await axios.post("/payments/create-preference", {
        title: "Plan Premium Wavv Music",
        price: 500, // Precio de ejemplo
        quantity: 1,
      });

      // 2. Mercado Pago nos devuelve un "init_point" (URL de pago)
      if (res.data.init_point) {
        window.location.href = res.data.init_point; // Redirigimos al usuario a Mercado Pago
      }
    } catch (error) {
      console.error("Error al iniciar el pago", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con Mercado Pago. Intenta más tarde.",
        background: "#111",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h1 className="display-4 fw-bold text-white">
            Lleva tu música al siguiente nivel
          </h1>
          <p className="text-secondary fs-5">
            Elige el plan que mejor se adapte a ti.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center gap-4">
        {/* Plan Gratis */}
        <Col md={5} lg={4}>
          <Card className="bg-dark text-white border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fs-2 fw-bold">Free</Card.Title>
              <h3 className="text-secondary mb-4">
                $0 <small>/mes</small>
              </h3>
              <ListGroup variant="flush" className="bg-transparent mb-4">
                <ListGroup.Item className="bg-transparent text-white border-secondary">
                  <i className="bx bx-check text-success me-2"></i> Escucha
                  todas las canciones
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-white border-secondary">
                  <i className="bx bx-x text-danger me-2"></i> Límite de 5
                  canciones en Playlist
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-secondary border-secondary">
                  Soporte estándar
                </ListGroup.Item>
              </ListGroup>
              <Button
                variant="outline-secondary"
                className="mt-auto w-100"
                disabled
              >
                Tu plan actual
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Plan Premium */}
        <Col md={5} lg={4}>
          <Card
            className="text-white h-100 shadow-lg border-primary"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              borderWidth: "2px",
            }}
          >
            <div className="position-absolute top-0 end-0 m-3">
              <span className="badge bg-primary">RECOMENDADO</span>
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fs-2 fw-bold text-primary">
                Premium
              </Card.Title>
              <h3 className="mb-4">
                $500 <small>/mes</small>
              </h3>
              <ListGroup variant="flush" className="bg-transparent mb-4">
                <ListGroup.Item className="bg-transparent text-white border-secondary">
                  <i className="bx bx-check text-primary me-2"></i> Playlist{" "}
                  <strong>Ilimitada</strong>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-white border-secondary">
                  <i className="bx bx-check text-primary me-2"></i> Sin anuncios
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-white border-secondary">
                  <i className="bx bx-check text-primary me-2"></i> Calidad de
                  audio superior
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-white border-secondary">
                  <i className="bx bx-check text-primary me-2"></i> Soporte 24/7
                </ListGroup.Item>
              </ListGroup>
              <Button
                onClick={handleBuy}
                disabled={loading}
                className="mt-auto w-100 py-2 fw-bold"
                style={{ backgroundColor: "#6f42c1", border: "none" }}
              >
                {loading ? "Procesando..." : "Suscribirme ahora"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SubscriptionScreen;
