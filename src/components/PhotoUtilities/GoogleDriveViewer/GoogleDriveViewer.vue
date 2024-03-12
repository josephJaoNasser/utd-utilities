<template>
  <div>
    <div v-if="!credentials?.access_token">
      <p>
        In order to access your google drive, you need to sign in to your google
        account
      </p>

      <UTDButton @click="googleLogin">
        <b-icon-google class="mr-2"></b-icon-google>
        Sign in
      </UTDButton>
    </div>

    <div v-else>
      You have google access <br />
      Token: {{ credentials.access_token }}
      <br />
      <UTDButton @click="handleSignOut"> Sign out </UTDButton>
    </div>
  </div>
</template>

<script>
import GoogleService from "@/services/GoogleService";
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import { photoUtilities, utilities } from "@/constants/UtilityTypes";

export default {
  name: "DrivePhotosViewer",
  components: {
    UTDButton,
  },
  data() {
    return {
      credentials: null,
    };
  },
  methods: {
    googleLogin() {
      const windowFeatures =
        "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

      window.open(this.authUrl, "Google OAuth", windowFeatures);
      window.addEventListener("message", (e) => {
        if (e.data?.code && e.data.code === "utd_utils_gauth") {
          const credentials = {
            access_token: e.data.access_token,
            token_type: e.data.token_type,
            expires_in: e.data.expires_in,
          };

          this.credentials = credentials;
          window.localStorage.setItem(
            "utd_utils_credentials",
            JSON.stringify(credentials)
          );
        }
      });
    },

    handleSignOut() {
      this.credentials = null;
      window.localStorage.removeItem("utd_utils_credentials");
    },
  },
  computed: {
    authUrl: () => {
      return GoogleService.getOauthURL({
        utilityType: utilities.photo,
        toPage: photoUtilities.googleDrive,
      });
    },
  },
  watch: {
    credentials(val) {},
  },
  mounted() {
    const utd_utils_credentials = window.localStorage.getItem(
      "utd_utils_credentials"
    );

    if (utd_utils_credentials) {
      this.credentials = JSON.parse(utd_utils_credentials);
    }
  },
};
</script>

<style lang="scss" scoped></style>
