import axios from "./axios"; // Importamos la instancia creada en axios.js

// Ahora las peticiones son funciones mas simples y cortas
export const registerRequest = (user) => axios.post(`/register`, user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifyTokenRequest = () => axios.get(`/profile`); // verifica si el usuario sigue logueado
export const logoutRequest = () => axios.post(`/logout`);