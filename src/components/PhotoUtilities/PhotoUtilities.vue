<template>
  <b-container v-if="isRedirect" class="text-center p-4">
    <b-icon-check-circle-fill
      font-scale="5"
      class="text-success mb-3"
    ></b-icon-check-circle-fill>
    <p>
      Connected successfully! Window will close in
      {{ redirectCountDown }} seconds...
    </p>
    <UTDButton type="light" onclick="window.close()">
      <b-icon-x></b-icon-x>
      Close now
    </UTDButton>
  </b-container>
  <b-container
    v-else
    fluid
    class="p-0 m-0 utd-utilities__photo-utilities d-flex h-100 position-relative"
  >
    <MobileNav
      class="d-sm-none"
      :current-utility="currentUtility"
      :google-credentials="googleCredentials"
      @utility-change="onUtilityChange"
      @uploader-toggled="toggleUploader"
      @create-album-toggled="toggleCreateAlbum"
      @google-picker-pick="handleGooglePickerPick"
      @back="handleBack"
    />

    <SideNav
      class="d-none d-sm-block"
      :current-utility="currentUtility"
      :google-credentials="googleCredentials"
      @utility-change="onUtilityChange"
      @uploader-toggled="toggleUploader"
      @create-album-toggled="toggleCreateAlbum"
      @google-picker-pick="handleGooglePickerPick"
      @back="handleBack"
    />

    <b-container
      fluid
      class="utd-utilities__photo-utilities__main px-0 mt-5 mt-sm-0"
    >
      <!-- Main section -->
      <PhotoViewer
        v-if="currentUtility === UtilityTypes.photo"
        :token="token"
        :user-id="accountId"
        :organization-id="organizationId"
        :photos="JSON.parse(JSON.stringify(photos))"
        @load="(e) => (photos = [...photos, ...e])"
        @photo-selected="onSelect"
      >
        <template #header="slotProps">
          <div
            class="mb-3 pt-3 d-flex justify-content-between align-items-center"
          >
            <h2 class="font-weight-bold mb-0">Photos</h2>
            <UTDButton @click="slotProps.toggleSearch" type="light">
              <b-icon-search></b-icon-search>
            </UTDButton>
          </div>
        </template>
      </PhotoViewer>
      <Albums
        v-if="currentUtility === UtilityTypes.album"
        id="utd-utilities__album"
        class="w-100"
        :token="token"
        :account-id="accountId"
        :default-albums="albums"
        @load="(e) => (albums = e)"
        @photo-selected="onSelect"
        @album-select="handleAlbumSelect"
      />
      <AlbumViewer
        v-if="currentUtility === UtilityTypes.albumViewer"
        :token="token"
        :selected-album="selectedAlbum"
        :account-id="accountId"
        :organization-id="organizationId"
        @photo-selected="onSelect"
        @back="selectedAlbum = null"
        @album-details-updated="handleAlbumDetailsUpdate"
      />
      <Moments
        v-if="currentUtility === UtilityTypes.moments"
        class="w-100"
        :token="token"
        :account-id="accountId"
        :organization-id="organizationId"
        @load="(e) => (moments = e)"
        @photo-selected="onSelect"
        :default-moments="moments"
      />
      <GoogleDriveViewer
        v-if="currentUtility === UtilityTypes.googleDrive"
        :credentials="googleCredentials"
      />
      <AIArtCreator
        v-if="currentUtility === UtilityTypes.ai"
        class="w-100"
        :token="token"
        :default-images="aiArt"
        @image-created="(e) => (aiArt = e)"
        @photo-selected="onSelect"
      />
    </b-container>
    <Uploader
      :token="token"
      :show="showUploader"
      :account-id="accountId"
      :organization-id="organizationId"
      @close="showUploader = false"
      @upload-completed="handleUploadComplete"
    />
    <CreateAlbum
      :token="token"
      :show="showCreateAlbum"
      :account-id="accountId"
      :organization-id="organizationId"
      @close="showCreateAlbum = false"
      @album-created="handleAlbumCreate"
    />
  </b-container>
</template>

<script>
import PhotoViewer from "./PhotoViewer";
import Albums from "./Albums";
import AlbumViewer from "./Albums/AlbumViewer.vue";
import AIArtCreator from "./AIArtCreator/AIArtCreator.vue";
import UTDButton from "../UTDButton";
import Uploader from "./components/Uploader.vue";
import CreateAlbum from "./components/CreateAlbum.vue";
import Moments from "./Moments";
import SideNav from "./components/SideNav.vue";
import MobileNav from "./components/MobileNav.vue";
import Search from "./components/Search.vue";
import { photoUtilities, utilities } from "@/constants/UtilityTypes";
import GoogleDriveViewer from "./GoogleDriveViewer";
import urlQueryToJson from "@/helpers/urlQueryToJson";
import GoogleService from "@/services/GoogleService";

export default {
  name: "PhotoUtilities",
  props: {
    accountId: Number,
    organizationId: Number,
    googleCredentials: Object,
    token: String,
  },
  components: {
    PhotoViewer,
    Albums,
    AlbumViewer,
    AIArtCreator,
    UTDButton,
    Uploader,
    CreateAlbum,
    Moments,
    SideNav,
    MobileNav,
    Search,
    GoogleDriveViewer,
  },
  emits: ["photo-selected"],
  data() {
    return {
      currentUtility: photoUtilities.photo,
      showUploader: false,
      showCreateAlbum: false,
      pageHistory: [photoUtilities.photo],
      pageHistoryIndex: 0,
      photos: [],
      albums: [],
      moments: [],
      aiArt: [],
      selectedAlbum: null,
      isRedirect: false,
      redirectCountDown: 0,
    };
  },
  methods: {
    onUtilityChange(util) {
      this.currentUtility = util;
      this.pageHistory.push(util);
      this.pageHistoryIndex += 1;
    },

    onSelect(e) {
      this.$emit("photo-selected", e);
    },

    handleUploadComplete(newPhoto) {
      this.photos.unshift(newPhoto);
    },

    handleAlbumCreate(albumData) {
      this.albums.unshift(albumData);
    },

    toggleCreateAlbum() {
      this.showCreateAlbum = true;
    },

    toggleUploader() {
      this.showUploader = true;
    },

    handleBack() {
      if (this.pageHistoryIndex > 0) {
        this.currentUtility = this.pageHistory[this.pageHistoryIndex - 1];
        this.pageHistory = this.pageHistory.slice(0, this.pageHistoryIndex);
        this.pageHistoryIndex -= 1;
      }
    },

    handleAlbumSelect(selectedAlbum) {
      this.selectedAlbum = selectedAlbum;
      this.onUtilityChange(this.UtilityTypes.albumViewer);
    },

    handleAlbumDetailsUpdate({ albumName, albumDescription, albumImage }) {
      this.selectedAlbum.albumImage = albumImage;
      this.selectedAlbum.albumName = albumName;
      this.selectedAlbum.albumDescription = albumDescription;
    },

    async handleGooglePickerPick(e) {
      try {
        const { thumbnailLink } = await GoogleService.getDrivePhoto(
          e.photo.id,
          e.token
        );

        const sizeRegex = new RegExp(/=s\d+/, "g");
        const imageUrl = thumbnailLink.replace(sizeRegex, "=s0");

        this.$emit("photo-selected", { url: imageUrl });
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    UtilityTypes: () => photoUtilities,
  },
  mounted() {
    const url = window.location.href;

    const [querySegment] = new URL(url).hash.split("/");
    const queries = urlQueryToJson(querySegment.substring(1));

    if (queries?.state) {
      queries.state = JSON.parse(queries.state);
    }

    if (queries?.access_token) {
      this.isRedirect =
        queries.state && queries.state.utilityType === utilities.photo;

      window.opener.postMessage({ ...queries, code: "utd_utils_gauth" });
    }
    if (this.isRedirect) {
      this.redirectCountDown = 3;
      let countdownInterval = setInterval(() => {
        this.redirectCountDown -= 1;
        if (!this.redirectCountDown) {
          clearInterval(countdownInterval);
          window.close();
        }
      }, 1000);
    }
  },
};
</script>

<style scoped lang="scss">
/* Using SCSS variables to store breakpoints */
$breakpoint-tablet: 768px;

.utd-utilities {
  &__photo-utilities {
    // &__main {
    //   overflow: auto;
    // }
  }
}
</style>
