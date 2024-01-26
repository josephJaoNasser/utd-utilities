<template>
  <div id="app">
    <PhotoUtilities
      :accountId="process.env.accountId"
      :token="process.env.token"
    />
  </div>
</template>

<script>
import UTDButton from "./components/UTDButton";
import PhotoUtilities from "./components/PhotoUtilities";

export default {
  name: "App",
  components: { UTDButton, PhotoUtilities },
  methods: {
    test() {
      alert("yo");
    },
  },
  computed: {
    credentials() {
      return {
        token: process.env.VUE_APP_TOKEN,
        accountId: process.env.VUE_APP_ACCOUNT_ID,
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
  margin: 30px auto;
}
</style>
