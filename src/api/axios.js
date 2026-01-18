import axios from "axios";

// Creamos una instancia personalizada
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // Permite que Axios envíe y reciba las cookies de sesión
});

export default instance;
