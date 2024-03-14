<template>
  <div id="app">
    <PhotoUtilities
      :accountId="credentials.accountId"
      :organization-id="credentials.organizationId"
      :token="credentials.token"
      :google-credentials="googleCredentials"
      @photo-selected="handlePhotoSelect"
    />
    <!-- <b-container fluid class="mt-5">
      <button style="margin: 0 auto" @click="selectedPhoto = null">
        Clear image
      </button>
      <br />
      <br />
      <img
        v-if="selectedPhoto"
        :src="selectedPhoto?.url"
        referrerPolicy="no-referrer"
        class="w-100"
      />
    </b-container> -->
  </div>
</template>

<script>
import UTDButton from "./components/UTDButton";
import PhotoUtilities from "./components/PhotoUtilities";

export default {
  name: "App",
  components: { UTDButton, PhotoUtilities },
  data() {
    return {
      selectedPhoto: null,
    };
  },
  methods: {
    handlePhotoSelect(e) {
      console.log(e);
      this.selectedPhoto = e;
    },
  },
  computed: {
    credentials() {
      return {
        token: process.env.VUE_APP_TOKEN || "",
        accountId: +process.env.VUE_APP_ACCOUNT_ID || null,
        organizationId: +process.env.VUE_APP_ORGANIZATION_ID || null,
      };
    },

    googleCredentials() {
      return {
        client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
        project_id: process.env.VUE_APP_GOOGLE_APP_ID,
        api_key: process.env.VUE_APP_GOOGLE_API_KEY,
        // client_secret: process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
        // redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/utd-utilities.scss";

@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";

html,
#app {
  height: 100%;
  margin: 0;
}

.utilities-container {
  height: 600px;
  width: 960px;
  border: 1px solid #ccc;
  border-radius: 20px;
  overflow: hidden;
  resize: both;
  margin: 0 auto;
}
</style>
