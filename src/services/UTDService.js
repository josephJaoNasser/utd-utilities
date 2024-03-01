import axiosInstance from "./AxiosInstance";

class UTDService {
  constructor(token) {
    this.axiosInstance = axiosInstance;

    this.axiosInstance.interceptors.request.use((config) => {
      config.headers["authorization"] = `Bearer ${token}`;
      return config;
    })
  }
}

export default UTDService;
