import axios from "./axios"; // Importamos la instancia creada en axios.js

// Ahora las peticiones son funciones mas simples y cortas
export const registerRequest = (user) => axios.post("/register", user);
export const loginRequest = (user) => axios.post("/login", user);
export const verifyTokenRequest = () => axios.get("/profile"); // verifica si el usuario sigue logueado
export const logoutRequest = () => axios.post("/logout");

/* 
export: Permite que se usar esta función en otros archivos (como en RegisterPage.jsx).

const registerRequest: Es el nombre de la función. Se suele usar el sufijo Request para saber que es una petición al servidor.

user => ...: Es una "arrow function" (función de flecha). Recibe un parámetro llamado user, que es el objeto con la información que el usuario escribió en el formulario (username, email, password).

axios.post(...): Axios le dice al navegador: "Envía una petición de tipo POST". El método POST se usa generalmente para enviar o crear información nueva en una base de datos.

"/register": Es la dirección a donde se envía la info. Al final, se traduce como: http://localhost:4003/api/register.

, user: Es el cuerpo (body) de la petición. Son los datos reales que viajan por internet hasta el backend. */