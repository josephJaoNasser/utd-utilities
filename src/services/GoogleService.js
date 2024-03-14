import { PHOTOS_PER_PAGE } from "@/constants/PaginationVariables";
import queryBuilder from "@/helpers/queryBuilder";
import axios from "axios";

class GoogleService {
  constructor({ client_id, client_secret, redirect_uri }) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
  }

  /**
   * Lists all google drive photos
   * @param {string} token
   * @returns
   */
  static async listDrivePhotos(token) {
    const q = encodeURI("mimeType='image/jpeg'");
    const fields = [
      "id",
      "webViewLink",
      "webContentLink",
      "iconLink",
      "name",
      "originalFilename",
      "thumbnailLink",
      "mimeType",
      "imageMediaMetadata",
    ].join(",");

    const url = `https://www.googleapis.com/drive/v3/files/?q=${q}&pageSize=${PHOTOS_PER_PAGE}&fields=files(${fields})`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return res.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves the google drive file
   * @param {string} fileId
   * @param {string} token
   * @returns
   */
  static async getDrivePhoto(fileId, token) {
    const fields = [
      "id",
      "name",
      "originalFilename",
      "thumbnailLink",
      "mimeType",
    ].join(",");

    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=${fields}`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Gets the OAuth screen link
   * @param {{
   *  toPage: string,
   *  utilityType: string
   * }} caller
   * @returns
   */
  getOauthURL({ toPage, utilityType }) {
    const scopes = [
      "https://www.googleapis.com/auth/drive",
      // "https://www.googleapis.com/auth/drive.appdata",
      // "https://www.googleapis.com/auth/drive.file",
      // "https://www.googleapis.com/auth/drive.metadata.readonly",
      // "https://www.googleapis.com/auth/drive.photos.readonly",
      // "https://www.googleapis.com/auth/drive.metadata",
    ];

    const scope = scopes.join(" ");
    let state;

    if (toPage && utilityType) {
      state = JSON.stringify({
        toPage,
        utilityType,
      });
    }

    const queryObj = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      scope,
      response_type: "token",
      ...(state && { state }),
    };

    const queryString = queryBuilder(queryObj);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth${queryString}`;

    return authUrl;
  }
}

export default GoogleService;
