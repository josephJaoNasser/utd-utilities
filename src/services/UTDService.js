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
   * Get all albums general information
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
   * Get album with photos
   * @returns
   */
  async getAlbumGallery(albumId, siteId) {
    try {
      const { data } = await this.axiosInstance.get(
        //`/site-builder/albums?accountId=11`
        `/site-builder/gallery?siteId=${siteId}&albumId=${albumId}`
      );

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Creates a new album
   * @param {{
   * albumName: string,
   * albumDescription: string,
   * albumImage: string,
   * parentAlbumId: number,
   * siteId: string,
   * accountId: number,
   * albumType: string
   * }} albumDetails
   * @returns
   */
  async createAlbum(albumDetails = {}) {
    try {
      const { data } = await this.axiosInstance.post(`/albums`, albumDetails);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Upload photos to an album
   * @param {{
   *  siteId: string,
   *  accountId: number,
   *  photos: FormData[],
   *  albumId: number,
   * }} options
   */
  async addAlbumPhotos(options) {
    try {
      const uploadResponses = await this.uploadFiles(options.photos);

      const addToAlbumResponses = uploadResponses.map(({ payload }) => {
        const { url, thumbnail } = payload;

        return this.axiosInstance.post(`/site-builder/gallery`, {
          payload: {
            image: url,
            imageThumbnail: thumbnail,
            albumId: options.albumId,
          },
          siteId: options.siteId,
        });
      });

      const albumLinkResponses = await Promise.all(addToAlbumResponses);
      return albumLinkResponses.map(({ data }) => data);
    } catch (e) {
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
   * @param { FormData[] } files
   */
  async uploadFiles(files) {
    try {
      const fileUploadPromises = files.map((file) => {
        return this.axiosInstance.post(`/file/upload`, file);
      });

      const responses = await Promise.all(fileUploadPromises);
      return responses.map((response) => response.data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * self explanatory
   * @param {FormData} file
   */
  async uploadSingleFile(file) {
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
   * @param {number} accountId
   */
  async generateAIImages(query, accountId) {
    try {
      const config = {
        model: "dall-e-3", // dall-e-3 or dall-e-2
        n: 1, // if dall-e-3 or 1-4 if dall-e-2
        size: "1024x1024", // (["1792x1024", "1024x1024", "1024x1792"])
        query,
        accountId,
      };

      const { data } = await this.axiosInstance.post(
        `/ai/image-generation`,
        config
      );

      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

export default UTDService;
