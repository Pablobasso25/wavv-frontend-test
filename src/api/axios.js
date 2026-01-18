import axios from "axios";

// Creamos una instancia personalizada
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Permite que Axios envíe y reciba las cookies de sesión
});

export default instance;
