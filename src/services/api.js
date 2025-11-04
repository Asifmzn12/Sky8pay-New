import axios from "axios"
import { encryptvalue } from "../utils/AESEncrypted"
import { DoAdminLogout } from "./AuthService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
// Get CSRF Token
function getCsrfToken(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}`))
    ?.split("=")[1];
}
//Consume CSRF Token API
export async function loadCsrfToken() {
  await api.get("/auth/csrf-token", { withCredentials: true });
}


// Concat Header value
function GenerateDynamicHeader(basetoken) {
  const slat = crypto.randomUUID().slice(0, 8);
  const timestamp = Date.now().toString();
  const mixed = `${encryptvalue(basetoken)}.${slat}.${timestamp}`;
  return btoa(mixed);
}

// interceptors request
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken("XSRF-TOKEN");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = GenerateDynamicHeader(csrfToken);
    }
    const authtoken = localStorage.getItem("token");
    if (authtoken) {
      config.headers["Authorization"] = `Bearer ${authtoken}`;
    }
    return config;
  }, (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = []
};

// interceptors response
api.interceptors.response.use(
  response => response,
  async (error) => {
    const orignialRequest = error.config;    
    if (error.response?.status === 401 && !orignialRequest._retry) {
      orignialRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const csrtoken = getCsrfToken("XSRF-TOKEN");
            if (csrtoken) {
              orignialRequest.headers["X-CSRF-TOKEN"] = GenerateDynamicHeader(csrtoken);
            }
            return api(orignialRequest);
          })
          .catch(Promise.reject);
      }
      isRefreshing = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/Auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        processQueue(null);

        const csrfToken = getCsrfToken("XSRF-TOKEN");
        if (csrfToken) {
          orignialRequest.headers["X-CSRF-TOKEN"] = GenerateDynamicHeader(csrfToken);
        }
        const authtoken = localStorage.getItem("token");
        if (authtoken) {
          orignialRequest.headers["Authorization"] = `Bearer ${authtoken}`;
        }
        return api(orignialRequest);
      } catch (err) {
        processQueue()
        await DoAdminLogout();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("serial");
        localStorage.removeItem("serialtype");
        window.location.replace("/");
        return Promise.reject(err);
      }
      finally {
        isRefreshing = false;
      }
    } else {
      if (error.response?.status === 403 || orignialRequest._retry) {
        processQueue()
        await DoAdminLogout();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("serial");
        localStorage.removeItem("serialtype");
        window.location.replace("/");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;