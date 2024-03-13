<template>
  <b-container fluid>
    <div v-if="!auth?.access_token">
      <p>
        In order to access your google drive, you need to sign in to your google
        account
      </p>

      <UTDButton @click="googleLogin">
        <b-icon-google class="mr-2"></b-icon-google>
        Sign in
      </UTDButton>
    </div>

    <b-container fluid v-else>
      <div>
        You have google access <br />
        Token: {{ auth.access_token }}
        <br />
        <UTDButton @click="handleSignOut"> Sign out </UTDButton>
      </div>
      <b-container fluid class="text-center mb-3 p-4" v-if="isPhotosLoading">
        <b-spinner label="Loading..." variant="primary" type="grow"></b-spinner>
      </b-container>
      <b-container v-else>
        <b-row cols="2" cols-sm="3" cols-md="4" cols-lg="5" cols-xl="6">
          <b-col v-for="photo in files" class="border m-2 p-3">
            <b-img fluid :src="photo.thumbnailLink || photo.iconLink"/>
            {{ photo.name }}
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </b-container>
</template>

<script>
import GoogleService from "@/services/GoogleService";
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import { photoUtilities, utilities } from "@/constants/UtilityTypes";

export default {
  name: "GoogleDriveViewer",
  props: {
    credentials: Object,
  },
  components: {
    UTDButton,
  },
  data() {
    return {
      auth: null,
      nextPageToken: null,
      isPhotosLoading: false,
      files: [],
    };
  },
  methods: {
    googleLogin() {
      const windowFeatures =
        "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

      window.open(this.authUrl, "Google OAuth", windowFeatures);

      window.removeEventListener("message", this.receiveAuth);
      window.addEventListener("message", this.receiveAuth);
    },

    handleSignOut() {
      this.auth = null;
      this.files = [];
      this.nextPageToken = null;
      window.localStorage.removeItem("utd_utils_credentials");
    },

    receiveAuth(e) {
      if (e.data?.code && e.data.code === "utd_utils_gauth") {
        const auth = {
          access_token: e.data.access_token,
          token_type: e.data.token_type,
          expires_in: e.data.expires_in,
        };

        this.auth = auth;
        window.localStorage.setItem(
          "utd_utils_credentials",
          JSON.stringify(auth)
        );
        this.getPhotos();
      }
    },

    async getPhotos() {
      this.isPhotosLoading = true;
      try {
        const { files, nextPageToken } = await GoogleService.listDrivePhotos(
          this.auth.access_token
        );

        this.files = files;
        this.nextPageToken = nextPageToken;
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },
  },
  computed: {
    authUrl() {
      const { client_id, client_secret, redirect_uri } = this.credentials;
      const Google = new GoogleService({
        client_id,
        client_secret,
        redirect_uri,
      });

      return Google.getOauthURL({
        utilityType: utilities.photo,
        toPage: photoUtilities.googleDrive,
      });
    },
  },

  async mounted() {
    const utd_utils_credentials = window.localStorage.getItem(
      "utd_utils_credentials"
    );

    if (utd_utils_credentials) {
      this.auth = JSON.parse(utd_utils_credentials);
      await this.getPhotos();
    }
  },
};
</script>

<style lang="scss" scoped></style>
