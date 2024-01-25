import queryBuilder from "@/helpers/queryBuilder";
import axiosInstance from "./AxiosInstance";

class UTDService {
  constructor(token) {
    this.axiosInstance = axiosInstance;

    this.axiosInstance.interceptors.request.use((config) => {
      config.headers["authorization"] = `Bearer ${token}`;
      return config;
    });
  }

  /**
   * shows albums of images of the client
   * We have two images entry point, show by user's upload or show all the images uploaded in the account (organization),
   * if you pass accountId = x, then it will show all the images in the account,
   * if no accountId is found, then it will get only all the images in uploaded by the user.
   * @param {*} accountId
   * @returns
   */
  async getAlbums(accountId) {
    try {
      const { data } = await this.axiosInstance.get(
        `/albums?accountId=${accountId}`
      );
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Shows the uploaded photos of the user
   * @param {{
   *  userId: number,
   *  accountId: number,
   *  limit: number,
   *  offset: number
   * }} query
   * @returns
   */
  async getPhotos(query) {
    const queryString = queryBuilder(query);
    try {
      const { data } = await this.axiosInstance.get(
        `/file/photos${queryString}`
      );
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * shows albums of images related to public holidays
   * @returns
   */
  async getMoments() {
    try {
      const { data } = await this.axiosInstance.get(`/albums-public/moments`);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * self explanatory
   * @returns
   */
  async uploadFile(file) {
    try {
      const { data } = await this.axiosInstance.post(`/file/upload`, file);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Use DALL-E to generate images
   * @param {string} query
   */
  async generateAIImage(query) {
    try {
      const { data } = await this.axiosInstance.get(
        "https://www.uptodateconnect.com/api/ai/image-generation",
        {
          model: "dall-e-3", // dall-e-3 or dall-e-2
          n: 1, // if dall-e-3 or 1-4 if dall-e-2
          size: "1024x1024", // (["1792x1024", "1024x1024", "1024x1792"])
          query,
        }
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

export default UTDService;
