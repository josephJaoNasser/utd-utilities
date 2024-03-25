<template>
  <b-container
    fluid
    class="p-0 m-0 utd-utilities__photo-utilities d-flex h-100 position-relative"
  >
    <NavMenu
      :current-utility="currentUtility"
      :google-credentials="googleCredentials"
      :disable-back="pageHistory?.length < 2"
      :disabled-utilities="disabledUtilities"
      :extensions="extensions"
      :is-google-multi-select="multiSelect"
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
        :multi-select="multiSelect"
        :utd-credentials="utdCredentials"
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
        :utd-credentials="utdCredentials"
        :default-albums="albums"
        @load="(e) => (albums = e)"
        @photo-selected="onSelect"
        @album-select="handleAlbumSelect"
      />
      <AlbumViewer
        v-if="currentUtility === UtilityTypes.albumViewer"
        :multi-select="multiSelect"
        :utd-credentials="utdCredentials"
        :selected-album="selectedAlbum"
        @photo-selected="onSelect"
        @back="selectedAlbum = null"
        @album-details-updated="handleAlbumDetailsUpdate"
      />
      <Moments
        v-if="currentUtility === UtilityTypes.moments"
        class="w-100"
        :utd-credentials="utdCredentials"
        :default-moments="moments"
        @album-select="handleAlbumSelect"
        @load="(e) => (moments = e)"
        @photo-selected="onSelect"
      />

      <AIArtCreator
        v-if="currentUtility === UtilityTypes.ai"
        class="w-100"
        :utd-credentials="utdCredentials"
        :ai-art-params="aiArtParams"
        :default-images="aiArt"
        @image-created="(e) => (aiArt = e)"
        @photo-selected="onSelect"
      />
      <PhotoViewer
        v-if="!!currentExtension"
        :multi-select="multiSelect"
        :utd-credentials="utdCredentials"
        :photos="JSON.parse(JSON.stringify(currentExtension.photos))"
        @load="(e) => (photos = [...photos, ...e])"
        @photo-selected="onSelect"
      >
        <template #header="slotProps">
          <div
            class="mb-3 pt-3 d-flex justify-content-between align-items-center"
          >
            <h2 class="font-weight-bold mb-0">{{ currentExtension.label }}</h2>
            <!-- <UTDButton @click="slotProps.toggleSearch" type="light">
              <b-icon-search></b-icon-search>
            </UTDButton> -->
          </div>
        </template>
      </PhotoViewer>
    </b-container>
    <Uploader
      :show="showUploader"
      :utd-credentials="utdCredentials"
      @close="showUploader = false"
      @upload-completed="handleUploadComplete"
    />
    <CreateAlbum
      :show="showCreateAlbum"
      :utd-credentials="utdCredentials"
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
import Search from "@/components/GeneralUIComponents/Search.vue";
import { photoUtilities, utilities } from "@/constants/UtilityTypes";
import GoogleService from "@/services/GoogleService";
import NavMenu from "./components/Nav/NavMenu.vue";

export default {
  name: "PhotoUtilities",
  props: {
    utdCredentials: Object,
    googleCredentials: Object,
    multiSelect: Boolean,
    extensions: {
      type: Array,
      default: () => [],
    },
    aiArtParams: {
      type: Array,
      default: () => [],
    },
    disabledUtilities: {
      type: Array,
      default: () => [],
    },
    activeUtility: {
      type: String,
      default: photoUtilities.photo,
    },
  },
  model: {
    prop: "activeUtility",
    event: "utility-change",
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
    NavMenu,
    Search,
  },
  emits: ["photo-selected", "utility-change"],
  data() {
    return {
      activeTab: this.activeUtility,
      showUploader: false,
      showCreateAlbum: false,
      pageHistory: [this.activeUtility],
      pageHistoryIndex: 0,
      photos: [],
      albums: [],
      moments: [],
      aiArt: [],
      selectedAlbum: null,
      isRedirect: false,
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
        const { photos, token } = e;
        const getPhotoPromises = photos.map((p) => {
          return GoogleService.getDrivePhoto(p.id, token);
        });

        const results = await Promise.all(getPhotoPromises);
        const imgData = results.map(({ thumbnailLink }) => {
          const sizeRegex = new RegExp(/=s\d+/, "g");
          const imageUrl = thumbnailLink.replace(sizeRegex, "=s0");
          return { url: imageUrl };
        });

        this.$emit("photo-selected", imgData);
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    UtilityTypes() {
      return photoUtilities;
    },
    currentUtility: {
      get() {
        return this.activeTab;
      },
      set(util) {
        this.activeTab = util;
        this.$emit("utility-change", util);
      },
    },
    currentExtension() {
      return this.extensions.find((ext) => ext.label === this.currentUtility);
    },
  },
  mounted() {
    if (this.disabledUtilities.includes(this.currentUtility)) {
      for (const key in photoUtilities) {
        if (
          this.disabledUtilities.includes(this.currentUtility) &&
          photoUtilities[key] !== photoUtilities.albumViewer
        ) {
          this.currentUtility = photoUtilities[key];
        }
      }
    }
  },
};
</script>

<style scoped lang="scss"></style>
