import { PHOTOS_PER_PAGE } from "@/constants/PaginationVariables";
import queryBuilder from "@/helpers/queryBuilder";
import axios from "axios";

class GoogleService {
  constructor({ client_id, client_secret, redirect_uri }) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
  }

  static async listDrivePhotos(token) {
    const q = encodeURI("mimeType='image/jpeg'");
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=${PHOTOS_PER_PAGE}`;

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

  getOauthURL({ toPage, utilityType }) {
    const scopes = [
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.photos.readonly",
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
