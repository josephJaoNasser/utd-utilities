<template>
  <div>
    <p>
      In order to access your google drive, you need to sign in to your google
      account
    </p>

    <UTDButton @click="googleLogin">
      <b-icon-google class="mr-2"></b-icon-google>
      Sign in
    </UTDButton>
  </div>
</template>

<script>
import GoogleService from "@/services/GoogleService";
import UTDButton from "@/components/UTDButton/UTDButton.vue";

export default {
  name: "DrivePhotosViewer",
  components: {
    UTDButton,
  },
  methods: {
    googleLogin() {
      const windowFeatures =
        "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

      const popupRef = window.open(
        this.authUrl,
        "Google OAuth",
        windowFeatures
      );
    },
  },
  computed: {
    authUrl: () => GoogleService.getOauthURL(),
  },
};
</script>

<style lang="scss" scoped></style>
