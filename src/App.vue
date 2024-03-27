<template>
  <div id="app">
    <BlockUtilities
      :utd-credentials="credentials"
      @block-selected="handleBlockSelect"
    />

    <!-- <PhotoUtilities
      :utdCredentials="credentials"
      :google-credentials="googleCredentials"
      :ai-art-params="aiArtParams"
      multi-select
      @photo-selected="handlePhotoSelect"
    /> -->
  </div>
</template>

<script>
import UTDButton from "./components/UTDButton";
import PhotoUtilities from "./components/PhotoUtilities";
import BlockUtilities from "./components/BlockUtilities/BlockUtilities.vue";
import { photoUtilities, utilities } from "@/constants/UtilityTypes";
import AIArtParams from "./constants/AIArtParams";
import testExtension from "./helpers/testExtension";

export default {
  name: "App",
  components: { UTDButton, PhotoUtilities, BlockUtilities },
  data() {
    return {
      selectedPhoto: null,
      testActiveUtility: photoUtilities.photo,
      aiArtParams: AIArtParams,
      testExtension: testExtension,
    };
  },
  methods: {
    handlePhotoSelect(e) {
      console.log(e);
      this.selectedPhoto = e;
    },

    handleBlockSelect(e) {
      console.log(e);
    },
  },
  computed: {
    credentials() {
      return {
        token: process.env.VUE_APP_TOKEN || "",
        userId: +process.env.VUE_APP_ACCOUNT_ID || null, // userId
        organizationId: +process.env.VUE_APP_ORGANIZATION_ID || null, // accountId
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

:root {
  --primary: #2a99d6;
}

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
