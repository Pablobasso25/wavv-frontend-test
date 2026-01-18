import axios from "./axios";

export const getSongsRequest = () => axios.get("/songs");
export const createSongRequest = (song) => axios.post("/songs", song);
export const deleteSongRequest = (id) => axios.delete(`/songs/${id}`);
export const getSongRequest = (id) => axios.get(`/songs/${id}`);