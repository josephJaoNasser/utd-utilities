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
        <UTDButton @click="toggleExpandNav" small type="light" class="mb-2">
          <b-icon-list v-if="!expandNav"></b-icon-list>
          <b-icon-x v-else></b-icon-x>
        </UTDButton>
        <div class="border-bottom mb-2 pb-3 position-relative">
          <UTDButton block @click="toggleUploadMenu">
            <b-icon-plus></b-icon-plus>
            <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
              Add Media
            </div>
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
                class="text-primary px-3 py-2"
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
                class="text-primary px-3 py-2"
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
              'nav-item',
              'mb-2',
              currentUtility === UtilityTypes.photo
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.photo)"
          >
            <b-icon-image></b-icon-image>
            <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
              Photos
            </div>
          </UTDButton>
          <UTDButton
            type="light"
            :class="[
              'nav-item',
              'mb-2',
              currentUtility === UtilityTypes.album
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.album)"
          >
            <b-icon-images></b-icon-images>
            <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
              Albums
            </div>
          </UTDButton>
          <UTDButton
            type="light"
            :class="[
              'nav-item',
              'mb-2',
              currentUtility === UtilityTypes.moments
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.moments)"
          >
            <b-icon-calendar-fill></b-icon-calendar-fill>
            <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
              Moments
            </div>
          </UTDButton>
          <UTDButton
            type="light"
            :class="[
              'nav-item',
              'mb-2',
              currentUtility === UtilityTypes.ai
                ? 'text-primary'
                : 'text-secondary',
            ]"
            @click="onUtilityChange(UtilityTypes.ai)"
          >
            <b-icon-stars></b-icon-stars>
            <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
              AI Image creator
            </div>
          </UTDButton>
        </div>
      </div>
    </div>
    <b-container fluid class="utd-utilities__photo-utilities__main">
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
      expandNav: false,
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

    toggleExpandNav() {
      this.expandNav = !this.expandNav;
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
    // &__main {
    //   overflow: auto;
    // }
    .photo-utilities {

      &__nav {
        font-weight: 600;
        padding: 15px 10px;

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
