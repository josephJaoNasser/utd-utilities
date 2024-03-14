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
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.credentials.client_id,
        scope: "https://www.googleapis.com/auth/drive.file",
        access_type: "offline",
        callback: this.handleAuthResult,
      });
    },
    createPicker() {
      if (this.pickerApiLoaded && this.accessToken) {
        const view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("image/jpeg,image/png,image/jpg,image/webp");

        const pickerBuilder = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setAppId(this.credentials.project_id)
          .setOAuthToken(this.accessToken)
          .setDeveloperKey(this.credentials.api_key)
          .setCallback(this.pickerCallback)
          .hideTitleBar()
          .addView(view);

        this.$emit("build", pickerBuilder);

        const picker = pickerBuilder.build();
        picker.setVisible(true);
      }
    },
    pickerCallback(data) {
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        this.$emit("picked", { photo: data.docs[0], token: this.accessToken });
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
