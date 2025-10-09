import axios from 'axios';

const api = axios.create({
    baseURL: 'https://6h82fbwn-5000.inc1.devtunnels.ms/',
    withCredentials: true,
});

export default api;