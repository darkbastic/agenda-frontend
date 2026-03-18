import axios from "axios";

const api = axios.create({
    baseURL: "https://agenda-backend-0vhd.onrender.com",
});

export default api;