import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
<<<<<<< HEAD
    baseURL: 'http://127.0.0.1:5000',
=======
    baseURL: 'http://localhost:5000',
>>>>>>> 182dae9 (Update)
=======
    baseURL: 'https://340v23tv-5000.inc1.devtunnels.ms',  // Remove trailing slash to avoid double slashes
>>>>>>> b35048a (removed login page)
    withCredentials: true,
});

export default api;