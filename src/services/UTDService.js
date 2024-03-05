import axiosInstance from "./AxiosInstance";

class UTDService {
  constructor(token) {
    this.axiosInstance = axiosInstance;
    this.token = token;

    this.axiosInstance.interceptors.request.use((config) => {
      config.headers["authorization"] = `Bearer ${token}`;
      return config;
    })
  }
}

export default UTDService;
