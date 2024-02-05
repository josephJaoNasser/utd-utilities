<template>
  <b-container
    fluid
    class="p-0 m-0 utd-utilities__photo-utilities d-flex h-100"
  >
    <div
      class="photo-utilities__nav"
      style="background-color: #f1f4f7; z-index: 1040"
    >
      <div class="position-sticky" style="top: 15px">
        <div class="border-bottom mb-2 pb-3 position-relative">
          <UTDButton pill @click="toggleUploadMenu">
            <b-icon-plus></b-icon-plus>
          </UTDButton>
          <ul
            v-if="showUploadMenu"
            class="photo-utilities__nav-dropdown text-primary position-absolute top-0"
            style="list-style: none"
          >
            <li>
              <UTDButton
                block
                type="light"
                class="text-primary"
                @click="toggleUploader"
              >
                <b-icon-image class="mr-2"></b-icon-image>
                Photo
              </UTDButton>
            </li>
            <li>
              <UTDButton
                block
                type="light"
                class="text-primary"
                @click="toggleCreateAlbum"
              >
                <b-icon-images class="mr-2"></b-icon-images>
                Album
              </UTDButton>
            </li>
          </ul>
        </div>
        <div class="d-flex flex-column">
          <UTDButton
            type="light"
            :class="[
              'mb-2',
              currentUtility === UtilityTypes.photo
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.photo)"
          >
            <b-icon-image></b-icon-image>
          </UTDButton>
          <UTDButton
            type="light"
            :class="[
              'mb-2',
              currentUtility === UtilityTypes.album
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.album)"
          >
            <b-icon-images></b-icon-images>
          </UTDButton>
          <UTDButton
            type="light"
            :class="[
              'mb-2',
              currentUtility === UtilityTypes.moments
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.moments)"
          >
            <b-icon-calendar-fill></b-icon-calendar-fill>
          </UTDButton>
          <UTDButton
            type="light"
            :class="[
              'mb-2',
              currentUtility === UtilityTypes.ai
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.ai)"
          >
            <b-icon-stars></b-icon-stars>
          </UTDButton>
        </div>
      </div>
    </div>
    <b-container fluid class="">
      <!-- Main section -->
      <PhotoViewer
        v-if="currentUtility === UtilityTypes.photo"
        :token="token"
        :account-id="accountId"
        :organization-id="organizationId"
        @load="(e) => (photos = e)"
        @photo-selected="onSelect"
        :default-photos="photos"
      />
      <Albums
        v-if="currentUtility === UtilityTypes.album"
        :token="token"
        :account-id="accountId"
        :organization-id="organizationId"
        @load="(e) => (albums = e)"
        @photo-selected="onSelect"
        :default-albums="albums"
      />
      <Moments
        v-if="currentUtility === UtilityTypes.moments"
        :token="token"
        :account-id="accountId"
        :organization-id="organizationId"
        @load="(e) => (moments = e)"
        @photo-selected="onSelect"
        :default-moments="moments"
      />
      <AIArtCreator
        :token="token"
        v-if="currentUtility === UtilityTypes.ai"
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
import AIArtCreator from "./AIArtCreator/AIArtCreator.vue";
import UTDButton from "../UTDButton";
import Uploader from "./Utils/Uploader.vue";
import CreateAlbum from "./Utils/CreateAlbum.vue";
import Moments from "./Moments";

const utilTypes = {
  photo: "photo",
  album: "album",
  moments: "moments",
  ai: "ai",
};

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
    AIArtCreator,
    UTDButton,
    Uploader,
    CreateAlbum,
    Moments,
  },
  emits: ["photo-selected"],
  data() {
    return {
      currentUtility: utilTypes.photo,
      showUploader: false,
      showCreateAlbum: false,
      showUploadMenu: false,
      photos: [],
      albums: [],
      moments: [],
      aiArt: [],
    };
  },
  methods: {
    onUtilityChange(util) {
      this.currentUtility = util;
    },

    onSelect(e) {
      this.$emit("photo-selected", e);
    },

    handleUploadComplete(newPhotos) {
      for (const photo of newPhotos) {
        this.photos.unshift(photo);
      }
    },

    handleAlbumCreate(albumData) {
      this.albums.unshift(albumData);
    },

    toggleUploadMenu() {
      this.showUploadMenu = !this.showUploadMenu;
    },

    toggleCreateAlbum() {
      this.showCreateAlbum = true;
      this.toggleUploadMenu();
    },

    toggleUploader() {
      this.showUploader = true;
      this.toggleUploadMenu();
    },
  },
  computed: {
    UtilityTypes() {
      return utilTypes;
    },
  },
};
</script>

<style scoped lang="scss">
/* Using SCSS variables to store breakpoints */
$breakpoint-tablet: 768px;

.utd-utilities {
  &__photo-utilities {
    .photo-utilities {
      // &__main {
      //   height: 100%;
      //   overflow: auto;
      // }

      &__nav {
        font-weight: 600;
        padding: 15px 10px;

        &-dropdown {
          list-style: none;
          top: 0;
          left: 55px;
          border: 1px solid #dedede;
          background: white;
          padding: 0;
          border-radius: 5px;
          overflow: hidden;
          width: max-content;
        }
      }
    }
  }
}
</style>
