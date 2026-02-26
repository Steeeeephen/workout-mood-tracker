import axios from 'axios';

// This creates a custom instance of Axios to use throughout the app for api calls.
// It's of course called 'api'.
const api = axios.create({
  // VITE_API_URL is defined in the Vercel settings
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  // I added an interceptor to the api to intercept the config object (request) and check for jwt before it is sent.
  // This automatically attaches the JWT to every request, so the backend can verify the user is authenticated.
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
