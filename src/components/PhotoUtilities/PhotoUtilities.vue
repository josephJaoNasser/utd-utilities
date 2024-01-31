<template>
  <b-card class="utd-utilities__photo-utilities" no-body>
    <b-container fluid>
      <b-row cols="1" cols-md="2" cols-lg="3">
        <b-col
          sm="4"
          md="3"
          lg="2"
          class="px-3"
          style="background-color: #f1f4f7"
        >
          <div class="pt-3">
            <div class="mb-5">
              <UTDButton
                block
                variant="primay"
                class="mb-4"
                @click="showUploader = true"
              >
                Upload Photo
              </UTDButton>
              <UTDButton block variant="primay" @click="showCreateAlbum = true">
                Create Album
              </UTDButton>
            </div>

            <b-nav class="photo-utilities__nav flex-md-column">
              <b-nav-item
                class="p-1"
                :active="currentUtility === UtilityTypes.photo"
                @click="onUtilityChange(UtilityTypes.photo)"
              >
                <b-icon-image></b-icon-image>
                Photos
              </b-nav-item>
              <b-nav-item
                class="p-1"
                :active="currentUtility === UtilityTypes.album"
                @click="onUtilityChange(UtilityTypes.album)"
              >
                <b-icon-images></b-icon-images>
                Albums
              </b-nav-item>
              <b-nav-item
                class="p-1"
                :active="currentUtility === UtilityTypes.moments"
                @click="onUtilityChange(UtilityTypes.moments)"
              >
                <b-icon-calendar-fill></b-icon-calendar-fill>
                Moments
              </b-nav-item>
              <b-nav-item
                class="p-1"
                :active="currentUtility === UtilityTypes.ai"
                @click="onUtilityChange(UtilityTypes.ai)"
              >
                <b-icon-brush></b-icon-brush>
                AI Image Builder
              </b-nav-item>
            </b-nav>
          </div>
        </b-col>

        <!-- Main section -->
        <b-col sm="8" md="9" lg="10" class="photo-utilities__main pb-3">
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
        </b-col>
      </b-row>
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
  </b-card>
</template>

<script>
import PhotoViewer from "./PhotoViewer";
import Albums from "./Albums";
import AIArtCreator from "./AIArtCreator/AIArtCreator.vue";
import UTDButton from "../UTDButton";
import Uploader from "./Uploader.vue";
import CreateAlbum from "./CreateAlbum.vue";
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
        .nav-link:not(.active) {
          color: #929292 !important;
        }

        @media (min-width: $breakpoint-tablet) {
          .nav-link {
            padding: 10px 0;
          }
        }
      }
    }
  }
}
</style>
