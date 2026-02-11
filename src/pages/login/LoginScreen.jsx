/*  import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";

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

export default LoginScreen;  */

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginScreen.css";
import ShowPassword from "./ShowPassword";

const LoginScreen = ({ show, handleClose }) => {
  const { login, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      handleClose();
      navigate("/");
    }
  }, [isAuthenticated, navigate, handleClose]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "password") {
      value = value.replace(/[<>\s]/g, "");
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  useEffect(() => {
    if (!show) {
      setError(null);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
    } catch (err) {
      console.error("Error capturado en el componente:", err);
      if (!err.response) setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="login-modal-dialog"
      contentClassName="login-modal-content"
      backdropClassName="modal-glass-backdrop"
    >
      <Modal.Body className="login-modal-body">
        <h2 className="login-title">Iniciar sesión</h2>

        {(error || (authErrors && authErrors.length > 0)) && (
          <Alert variant="danger">{error || authErrors[0]}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="login-label">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Usuario@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="login-label">Contraseña</Form.Label>
            <ShowPassword
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
              placeholder="Contraseña"
            />
          </Form.Group>

          <Button type="submit" className="login-btn w-100" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </Button>
        </Form>

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="login-register-link"
            onClick={handleClose}
          >
            Regístrate aquí
          </Link>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginScreen;
