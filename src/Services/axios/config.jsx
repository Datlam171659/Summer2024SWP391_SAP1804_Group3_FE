import axios from 'axios';

const axiosClient = axios.create({
  //  baseURL: 'https://localhost:7262/',
  baseURL: 'https://gjewellery.bsite.net',

  headers: {
    'Content-type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = 'application/json';

      // Kiểm tra loại dữ liệu gửi vào
      if (config.data instanceof FormData) {
        // Nếu dữ liệu là FormData (multipart/form-data), đặt Content-Type tương ứng
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Nếu không phải FormData, đặt Content-Type là application/json
        config.headers['Content-Type'] = 'application/json';
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
