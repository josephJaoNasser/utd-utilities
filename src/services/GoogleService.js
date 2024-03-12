import queryBuilder from "@/helpers/queryBuilder";

class GoogleService {
  constructor() {}

  async getPicker() {}

  getOauthURL({ toPage, utilityType }) {
    const scopes = [
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.photos.readonly",
    ];

    const client_id = process.env.VUE_APP_GOOGLE_CLIENT_ID;
    const client_secret = process.env.VUE_APP_GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.VUE_APP_GOOGLE_REDIRECT_URI;

    const scope = scopes.join(" ");
    let state;

    if (toPage && utilityType) {
      state = JSON.stringify({
        toPage,
        utilityType,
      });
    }

    const queryObj = {
      client_id,
      redirect_uri,
      scope,
      response_type: "token",
      ...(state && { state }),
    };

    const queryString = queryBuilder(queryObj);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth${queryString}`;

    return authUrl;
  }
}

export default new GoogleService();
