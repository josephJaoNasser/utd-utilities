<template>
  <UTDButton
    v-bind="$attrs"
    @click="handleButtonClick"
    :disabled="!pickerApiLoaded"
  >
    <slot></slot>
  </UTDButton>
</template>
<script>
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import GoogleService from "@/services/GoogleService";

export default {
  name: "GooglePickerButton",
  props: {
    credentials: Object,
    multiSelect: Boolean,
  },
  components: {
    UTDButton,
  },
  emits: ["picked", "build"],
  data() {
    return {
      picked: {},
      pickerApiLoaded: false,
      accessToken: "",
      tokenClient: null,
    };
  },
  methods: {
    handleButtonClick() {
      if (!!this.accessToken) {
        return this.createPicker();
      }

      this.tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
          console.log(response);
          return;
        }

        const credentialsToStore = {
          access_token: response.access_token,
          expires_in: response.expires_in * 1000,
          token_type: response.token_type,
          access_dateTime: new Date().getTime(),
        };

        window.localStorage.setItem(
          "utd_utils_credentials",
          JSON.stringify(credentialsToStore)
        );
        this.accessToken = response.access_token;
        this.createPicker();
      };

      if (this.accessToken === null) {
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    },
    gisLoaded() {
      const scopes = [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
        "https://www.googleapis.com/auth/drive.readonly",
      ].join(" ");

      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.credentials.client_id,
        scope: scopes,
        access_type: "offline",
        callback: this.handleAuthResult,
      });
    },
    createPicker() {
      if (this.pickerApiLoaded && this.accessToken) {
        const view = new google.picker.DocsView();
        view.setMimeTypes("image/jpeg,image/png,image/jpg,image/webp");
        view.setIncludeFolders(true);

        const pickerBuilder = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .setAppId(this.credentials.project_id)
          .setOAuthToken(this.accessToken)
          .setDeveloperKey(this.credentials.api_key)
          .setCallback(this.pickerCallback)
          .hideTitleBar()
          .addView(view);

        if (this.multiSelect) {
          pickerBuilder.enableFeature(
            google.picker.Feature.MULTISELECT_ENABLED
          );
        }

        this.$emit("build", pickerBuilder);

        const picker = pickerBuilder.build();
        picker.setVisible(true);
      }
    },
    pickerCallback(data) {
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        this.$emit("picked", { photos: data.docs, token: this.accessToken });
      }
    },
    isLocalCredentialsValid() {
      const localCredentials = window.localStorage.getItem(
        "utd_utils_credentials"
      );

      if (!localCredentials) return false;

      const { expires_in, access_dateTime } = JSON.parse(localCredentials);

      const expirationDate = access_dateTime + expires_in;
      const currentDate = new Date().getTime();

      return currentDate < expirationDate;
    },
  },
  mounted() {
    if (this.isLocalCredentialsValid()) {
      const { access_token } = JSON.parse(
        window.localStorage.getItem("utd_utils_credentials")
      );

      this.accessToken = access_token;
    } else {
      this.accessToken = null;
    }

    if (!window.gapi) return console.warn("Google API not loaded");
    window.gapi.load("auth2");
    window.gapi.load("picker", () => {
      this.pickerApiLoaded = true;
      this.gisLoaded();
    });
  },
};
</script>
