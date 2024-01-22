<template>
  <b-card no-body style="max-width: 1200px; margin: 0 auto">
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

          <b-nav vertical>
            <b-nav-item
              class="p-1"
              :active="currentUtility === UtilityTypes.photo"
              @click="onUtilityChange(UtilityTypes.photo)"
            >
              Photos
            </b-nav-item>
            <b-nav-item
              class="p-1"
              :active="currentUtility === UtilityTypes.album"
              @click="onUtilityChange(UtilityTypes.album)"
            >
              Albums
            </b-nav-item>
            <b-nav-item
              class="p-1"
              :active="currentUtility === UtilityTypes.moments"
              @click="onUtilityChange(UtilityTypes.moments)"
            >
              Moments
            </b-nav-item>
            <b-nav-item
              class="p-1"
              :active="currentUtility === UtilityTypes.ai"
              @click="onUtilityChange(UtilityTypes.ai)"
            >
              AI Image Builder
            </b-nav-item>
          </b-nav>
        </b-col>

        <!-- Main section -->
        <b-col sm="8" md="9" class="p-4">
          <PhotoViewer
            :class="[currentUtility !== UtilityTypes.photo && 'd-none']"
            :token="token"
          />
          <Albums
            :class="[currentUtility !== UtilityTypes.album && 'd-none']"
            :token="token"
            :account-id="accountId"
          />
        </b-col>
      </b-row>
    </b-container>
    <Uploader :show="showUploader" @close="showUploader = false" />
    <CreateAlbum :show="showCreateAlbum" @close="showCreateAlbum = false" />
  </b-card>
</template>

<script>
import PhotoViewer from "../PhotoViewer";
import Albums from "../Albums";
import AIArtCreator from "../AIArtCreator/AIArtCreator.vue";
import UTDButton from "../UTDButton";
import Uploader from "./Uploader.vue";
import CreateAlbum from "./CreateAlbum.vue";

const utilTypes = {
  photo: "photo",
  album: "album",
  moments: "moments",
  ai: "ai",
};

export default {
  name: "PhotoUtilities",
  components: {
    PhotoViewer,
    Albums,
    AIArtCreator,
    UTDButton,
    Uploader,
    CreateAlbum,
  },
  data() {
    return {
      currentUtility: utilTypes.photo,
      showUploader: false,
      showCreateAlbum: false,

      // remove this during production
      accountId: 180,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgwLCJpYXQiOjE3MDU2NTEwNzcsImV4cCI6MTcwODI0MzA3N30.QcMTNvHkH-cMCcNhWkADP9Q-OXfWt_r6dXnMdiEuyY8",
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
