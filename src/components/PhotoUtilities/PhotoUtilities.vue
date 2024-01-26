<template>
  <b-card
    class="utd-utilities__photo-utilities"
    no-body
    style="max-width: 1200px; margin: 0 auto"
  >
    <b-container fluid>
      <b-row cols="1" cols-md="2">
        <b-col
          sm="4"
          md="3"
          class="py-5 px-4"
          style="background-color: #f1f4f7"
        >
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

          <b-nav class="photo-utilities-nav flex-md-column">
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
        </b-col>

        <!-- Main section -->
        <b-col sm="8" md="9" class="photo-utilities__main p-3 p-sm-4">
          <PhotoViewer
            v-if="currentUtility === UtilityTypes.photo"
            :token="token"
            @load="(e) => (photos = e)"
            :default-photos="photos"
          />
          <Albums
            v-if="currentUtility === UtilityTypes.album"
            :token="token"
            :account-id="accountId"
            @load="(e) => (albums = e)"
            :default-albums="albums"
          />
          <Moments
            v-if="currentUtility === UtilityTypes.moments"
            :token="token"
            :account-id="accountId"
            @load="(e) => (moments = e)"
            :default-moments="moments"
          />
          <AIArtCreator
            :token="token"
            v-if="currentUtility === UtilityTypes.ai"
            :default-images="aiArt"
            @image-created="(e) => (aiArt = e)"
          />
        </b-col>
      </b-row>
    </b-container>
    <Uploader
      :token="token"
      :show="showUploader"
      @close="showUploader = false"
    />
    <CreateAlbum
      :token="token"
      :show="showCreateAlbum"
      @close="showCreateAlbum = false"
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
  },
  computed: {
    UtilityTypes() {
      return utilTypes;
    },
  },
};
</script>

<style scoped lang="scss">
.utd-utilities {
  &__photo-utilities {
    .photo-utilities {
      &__main {
        max-height: 700px;
        overflow: auto;
      }

      &__nav {
        font-weight: 600;
        .nav-link:not(.active) {
          color: #929292;
        }
      }
    }
  }
}
</style>
