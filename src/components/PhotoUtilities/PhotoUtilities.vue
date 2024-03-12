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
      @utility-change="onUtilityChange"
      @uploader-toggled="toggleUploader"
      @create-album-toggled="toggleCreateAlbum"
      @back="handleBack"
    />

    <SideNav
      class="d-none d-sm-block"
      :current-utility="currentUtility"
      @utility-change="onUtilityChange"
      @uploader-toggled="toggleUploader"
      @create-album-toggled="toggleCreateAlbum"
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
      <GoogleDriveViewer v-if="currentUtility === UtilityTypes.googleDrive" />
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

export default {
  name: "PhotoUtilities",
  props: {
    accountId: Number,
    organizationId: Number,
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
      this.onUtilityChange(UtilityTypes.albumViewer);
    },

    handleAlbumDetailsUpdate({ albumName, albumDescription, albumImage }) {
      this.selectedAlbum.albumImage = albumImage;
      this.selectedAlbum.albumName = albumName;
      this.selectedAlbum.albumDescription = albumDescription;
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
      // localStorage.setItem(
      //   "photo_utilities_auth_result",
      //   JSON.stringify(queries)
      // );
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

    .photo-utilities {
      &__nav {
        font-weight: 600;
        padding: 15px 10px;
        background-color: #f1f4f7;
        z-index: 1040;

        &-dropdown {
          list-style: none;
          top: 0;
          right: -110px;
          background: white;
          padding: 0;
          border-radius: 5px;
          width: max-content;
          -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);
          -moz-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);
          box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);

          button {
            background-color: white;
            border: none;

            &:hover {
              background-color: #efefef;
            }
          }

          &:before {
            content: " ";
            width: 0;
            height: 0;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            position: absolute;
            border-right: 10px solid white;
            left: -9.5px;
            top: 9px;
          }
        }

        button {
          display: flex;
          align-items: center;
          gap: 5px;
          text-align: left;
          box-shadow: none;

          &.nav-item {
            background: none;
            border: none;

            &:hover {
              background-color: #dfefff;
            }

            &:focus {
              box-shadow: none;
            }
          }
        }

        .nav-menu-item-text {
          width: 0%;
          height: 0%;
          overflow: hidden;
          display: none;
          transition: all 0.5s;
          margin-left: 12px;

          &.expanded {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
  }
}
</style>
./components/Uploader.vue./components/CreateAlbum.vue./components/SideNav.vue./components/MobileNav.vue
