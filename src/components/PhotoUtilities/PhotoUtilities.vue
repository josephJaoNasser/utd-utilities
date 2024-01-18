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
            <UTDButton block variant="primay" class="mb-4">
              Upload Photo
            </UTDButton>
            <UTDButton block variant="primay">Create Album</UTDButton>
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
          <PhotoViewer v-if="currentUtility === UtilityTypes.photo" />
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import PhotoViewer from "../PhotoViewer";
import AlbumPicker from "../AlbumPicker/AlbumPicker.vue";
import AIArtCreator from "../AIArtCreator/AIArtCreator.vue";
import UTDButton from "../UTDButton";

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
    AlbumPicker,
    AIArtCreator,
    UTDButton,
  },
  data() {
    return {
      currentUtility: utilTypes.photo,
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
