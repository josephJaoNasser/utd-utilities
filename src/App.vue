<template>
  <div id="app">
    <PhotoUtilities
      :accountId="credentials.accountId"
      :organization-id="credentials.organizationId"
      :token="credentials.token"
      @photo-selected="handlePhotoSelect"
    />
    <!-- <b-container fluid class="mt-5">
      <button style="margin: 0 auto" @click="selectedPhoto = null">
        Clear image
      </button>
      <br />
      <br />
      <b-img-lazy
        blankColor="#bbb"
        fluid
        v-if="selectedPhoto"
        :src="selectedPhoto?.url"
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
