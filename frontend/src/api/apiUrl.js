import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
    baseURL: 'http://127.0.0.1:5000',
=======
    baseURL: 'http://localhost:5000',
>>>>>>> 182dae9 (Update)
    withCredentials: true,
});

export default api;