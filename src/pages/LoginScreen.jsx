import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login, isAuthenticated, errors: authErrors } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // EFECTO DE NAVEGACIÓN:
  // Si isAuthenticated cambia a true (porque el contexto se actualizó),
  // si el login es exitoso, te manda al Home automáticamente.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    let value = event.target.value;
    if (event.target.name === "password") {
      value = value.replace(/[<>\s]/g, "");
    }
    setFormData({ ...formData, [event.target.name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Usamos la función del contexto que ya tenemos creada.
      // Esta función internamente hace el setUser y setIsAuthenticated(true)
      await login(formData);

      // No hace falta el navigate acá porque el useEffect de arriba
      // detectará el cambio en isAuthenticated y te redirigirá.
    } catch (err) {
      setError("Credenciales incorrectas o error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="bg-dark text-white border-secondary shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar sesión</h2>

              {/* Mostramos errores locales o errores que vengan del backend (Zod) */}
              {(error || authErrors.length > 0) && (
                <Alert variant="danger">{error || authErrors[0]}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-primary-custom w-100 py-2"
                  disabled={loading}
                >
                  {loading ? "Iniciando sesión..." : "Ingresar"}
                </Button>
              </Form>

              <p className="text-secondary mt-3 text-center">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-primary text-decoration-none"
                >
                  Regístrate aquí
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
