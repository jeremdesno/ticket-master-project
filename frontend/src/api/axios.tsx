import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let sessionExpired = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          if (!sessionExpired) {
            sessionExpired = true; // Prevents multiple requests raisong this alertalerts

            alert('Your session has expired. Redirecting to login.');

            window.location.href = '/';

            setTimeout(() => {
              sessionExpired = false;
            }, 10000);
          }
          break;
        default:
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
