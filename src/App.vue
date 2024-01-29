<template>
  <div id="app">
    <PhotoUtilities
      :accountId="credentials.accountId"
      :token="credentials.token"
      @photo-selected="(e) => (selectedPhoto = e)"
    />
    <b-container fluid class="mt-5">
      <button style="margin: 0 auto" @click="selectedPhoto = null">
        Clear image
      </button>
      <br />
      <br />
      <b-img fluid v-if="selectedPhoto" :src="selectedPhoto?.url" />
    </b-container>
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
  computed: {
    credentials() {
      return {
        token: process.env.VUE_APP_TOKEN || "",
        accountId: +process.env.VUE_APP_ACCOUNT_ID || "",
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/utd-utilities.scss";

@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";

#app {
  //margin: 30px auto;
}
</style>
