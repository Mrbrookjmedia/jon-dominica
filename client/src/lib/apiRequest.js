// // client/src/lib/apiReques.js

// import axios from "axios";
// const apiRequest = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  
//   //  baseURL: "https://phoenixlabs-agal.onrender.com/api", //for deployment
//   withCredentials: true,
//   headers: {
//     "Cache-Control": "no-cache" // ADD THIS
//   }
// });
// export default apiRequest;

import axios from "axios";

function getCookieByName(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  withCredentials: true,
});

// Add a request interceptor to include the JWT token in headers
apiRequest.interceptors.request.use(
  (config) => {
    const token = getCookieByName('jwt');
    console.log(token, "hlo ji error ha ye to " )
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiRequest;
