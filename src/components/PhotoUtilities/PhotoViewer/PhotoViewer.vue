<template>
  <b-container
    fluid
    class="utd-utilities__photo-viewer position-relative h-100 px-0"
  >
    <b-container
      fluid
      :class="['sticky-top border-bottom']"
      :style="headerStyle"
      ref="header"
    >
      <slot name="header" :toggleSearch="toggleSearch"> </slot>
    </b-container>

    <div class="utd-utilities__search shadow" v-if="showSearch">
      <Search
        class="w-full"
        :searchSource="SearchSource.photos"
        :utd-credentials="utdCredentials"
        @search-start="handleSearchStart"
        @search-complete="handleSearchComplete"
        @search-end="handleSearchEnd"
        @close="onSearchClose"
      />
    </div>

    <b-container fluid class="h-100 px-0">
      <b-row :class="['h-100 w-100 mx-0 px-0', selectedAlbum ? 'mt-3' : '']">
        <!-- Photo grid column -->
        <b-col
          order="2"
          order-sm="1"
          class="photo-grid-container w-100 px-0"
          :style="gridContainerStyle"
          ref="photo-grid-container"
        >
          <b-container fluid v-if="!photos?.length && !isPhotosLoading">
            <p class="text-center p-4">
              <i> No photos to show... </i>
            </p>
          </b-container>

          <b-container
            fluid
            v-if="!searchResults?.length && !isSearching && isUsingSearch"
            @click="clearSearch"
          >
            <p class="text-center p-4">
              <i> No matching results for "{{ searchString }}"... </i>
              <br />
              <br />
              <UTDButton type="light">
                <b-icon-chevron-left></b-icon-chevron-left>
                Back to photos
              </UTDButton>
            </p>
          </b-container>

          <b-row
            ref="photo-grid"
            v-if="!isUsingSearch"
            class="utd-utilities__photo-grid px-3 py-3"
            style="overflow: auto"
            cols="2"
            cols-sm="3"
            cols-md="4"
            cols-lg="5"
            cols-xl="6"
            no-gutters
          >
            <b-col
              v-for="photo in photos"
              class="photo-grid-item p-1"
              :key="photo.id"
            >
              <PhotoListItem
                class="h-100"
                :photoDetails="photo"
                :show-set-album-cover="!!selectedAlbum"
                :active="isPhotoActive(photo)"
                @click="onSelect(photo)"
                @album-cover-set="setAlbumImage(photo)"
                @quick-select="$emit('photo-selected', [photo])"
                @quick-edit="openEditSection(photo)"
              />
            </b-col>
          </b-row>
          <b-row
            ref="photo-grid"
            v-else
            class="utd-utilities__photo-grid px-3 py-3"
            style="overflow: auto"
            cols="2"
            cols-sm="3"
            cols-md="4"
            cols-lg="5"
            cols-xl="6"
            no-gutters
          >
            <b-col
              v-for="photo in searchResults"
              class="photo-grid-item p-1"
              @click="onSelect(photo)"
              :key="photo.id"
            >
              <PhotoListItem
                class="h-100"
                :photoDetails="photo"
                :active="isPhotoActive(photo)"
                :show-set-album-cover="!!selectedAlbum"
                @click="onSelect(photo)"
                @album-cover-set="setAlbumImage(photo)"
                @quick-select="$emit('photo-selected', [photo])"
                @quick-edit="openEditSection(photo)"
              />
            </b-col>
          </b-row>
          <b-container
            fluid
            class="text-center mb-3 p-4"
            v-if="isPhotosLoading || isSearching"
          >
            <b-spinner
              label="Loading..."
              variant="primary"
              type="grow"
            ></b-spinner>
          </b-container>
        </b-col>

        <!-- edit section column -->
        <b-col
          v-if="showEditSection && checkBreakpoint(windowWidth) === 'xs'"
          cols="12"
          sm="6"
          md="5"
          lg="4"
          xl="3"
          order="1"
          order-sm="2"
          class="p-0 border-left"
          :style="photoDetailsContainerStyle"
        >
          <PhotoDetails
            v-if="!isPhotosLoading"
            class="utd-utilities__photoDetails pt-3"
            :photo-details="editingPhoto"
            @close="showEditSection = false"
            @photo-selected="onSelectConfirm"
          />
        </b-col>

        <b-container
          v-if="selectedPhotos.length"
          fluid
          class="utd-utilities__photo-actions"
          ref="photoActions"
        >
          <div class="d-flex">
            <div class="border-right pr-2 mr-2">
              <UTDButton
                type="light"
                size="sm"
                class="mr-2"
                @click="
                  () => {
                    selectedPhotos = [];
                    showEditSection = false;
                  }
                "
              >
                <b-icon-chevron-left class="mr-1"></b-icon-chevron-left>
                <span class="d-none d-sm-inline-block">Cancel</span>
              </UTDButton>
            </div>
            <UTDButton
              v-if="selectedPhotos.length < 2"
              type="light"
              size="sm"
              class="mr-2"
              @click="openEditSection(selectedPhotos[0])"
            >
              <b-icon-pencil class="mr-1"></b-icon-pencil>
              <span class="d-none d-sm-inline-block">Edit details</span>
            </UTDButton>
            <UTDButton
              v-if="selectedAlbum && selectedPhotos.length < 2"
              :loading="isSettingAlbumImage"
              @click="setAlbumImage(selectedPhotos[0])"
              type="light"
              size="sm"
              class="mr-2"
            >
              <b-icon-image class="mr-1"></b-icon-image>
              <span class="d-none d-sm-inline-block">Set album cover</span>
            </UTDButton>
            <UTDButton size="sm" @click="onSelectConfirm">
              <b-icon-plus class="mr-1"></b-icon-plus>
              <span class="d-none d-sm-inline-block">Add photos</span>
            </UTDButton>
          </div>
        </b-container>
      </b-row>
    </b-container>
    <PhotoDetails
      v-if="
        !isPhotosLoading &&
        showEditSection &&
        checkBreakpoint(windowWidth) === 'sm'
      "
      class="utd-utilities__photoDetails-desktop pt-3 shadow"
      :photo-details="editingPhoto"
      @close="closeEditSection"
      @photo-selected="onSelectConfirm"
    />
  </b-container>
</template>
<script>
import PhotoService from "@/services/PhotoService";
import PhotoDetails from "./PhotoDetails.vue";
import PhotoListItem from "./PhotoListItem.vue";
import UTDInput from "@/components/UTDInput";
import EditPhoto from "./EditPhoto.vue";
import UTDButton from "@/components/UTDButton";
import Search from "../components/Search.vue";
import SearchSource from "@/constants/SearchSource";
import { PHOTOS_PER_PAGE } from "@/constants/PaginationVariables";
import { checkBreakpoint } from "@/helpers/breakpoints";

export default {
  name: "PhotoViewer",
  components: {
    PhotoDetails,
    PhotoListItem,
    UTDInput,
    EditPhoto,
    UTDButton,
    Search,
  },
  props: {
    utdCredentials: Object,
    selectedAlbum: Object,
    multiSelect: Boolean,
    photos: {
      type: Array,
      default: () => [],
    },
    query: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["load", "photo-selected", "album-image-updated"],
  model: {
    prop: "photos",
    event: "load",
  },
  data() {
    return {
      editingPhoto: null,
      selectedPhotos: [],
      showEditSection: false,
      isPhotosLoading: false,
      isSettingAlbumImage: false,
      isEnd: false,
      windowWidth: window.innerWidth,
      showSearch: false,
      isSearching: false,
      isUsingSearch: false,
      searchString: "",
      searchResults: [],
    };
  },
  methods: {
    checkBreakpoint,

    async getPhotos() {
      this.isPhotosLoading = true;

      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const { rows } = await UTD.getPhotos({
          userId: this.utdCredentials.userId,
          accountId: this.utdCredentials.organizationId,
          limit: PHOTOS_PER_PAGE,
          offset: this.photos.length,
        });

        if (!rows?.length) this.isEnd = true;

        this.$emit("load", rows);
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },

    async setAlbumImage(photoDetails) {
      this.isSettingAlbumImage = true;
      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const res = await UTD.editAlbum(this.selectedAlbum.id.toString(), {
          albumImage: photoDetails.url,
        });

        if (res.success) {
          this.$emit("album-image-updated", photoDetails.url);
        }
      } catch (e) {
        console.log(e);
      }
      this.isSettingAlbumImage = false;
    },

    onSelectConfirm() {
      this.$emit("photo-selected", this.selectedPhotos);
    },

    onSelect(photoDetails) {
      if (!this.multiSelect) {
        this.selectedPhotos = [photoDetails];
        return;
      }

      const selectedPhotoIndex = this.selectedPhotos.findIndex(
        (photo) => photo.id === photoDetails.id
      );

      if (selectedPhotoIndex < 0) {
        this.selectedPhotos.push(photoDetails);
      } else {
        this.selectedPhotos.splice(selectedPhotoIndex, 1);
      }
    },

    onSearchClose() {
      this.showSearch = false;
      this.isUsingSearch = false;
    },

    isPhotoActive(photoDetails) {
      const selectedPhotoIndex = this.selectedPhotos.findIndex(
        (photo) => photo.id === photoDetails.id
      );

      return selectedPhotoIndex > -1;
    },

    openEditSection(photoDetails) {
      this.editingPhoto = photoDetails;
      this.showEditSection = true;
    },

    closeEditSection() {
      this.editingPhoto = null;
      this.showEditSection = false;
    },

    setWindowWidth() {
      this.windowWidth = window.innerWidth;
    },

    toggleSearch() {
      this.showSearch = !this.showSearch;
    },

    handleSearchComplete({ result }) {
      this.isUsingSearch = true;
      this.searchResults = result;
    },

    handleSearchStart() {
      this.isUsingSearch = true;
      this.isSearching = true;
      this.selectedPhotos = [];
    },

    handleSearchEnd(e) {
      this.isSearching = false;
      this.searchString = e;
    },

    clearSearch() {
      this.isUsingSearch = false;
      this.searchResults = [];
    },

    handleScroll() {
      if (this.isEnd || this.isUsingSearch || !!this.selectedAlbum) return;

      const photoGrid = this.$refs["photo-grid"];
      const MARGIN = 2;

      const photoGridBottom = photoGrid.getBoundingClientRect().bottom;

      if (
        photoGridBottom <= window.innerHeight + MARGIN &&
        !this.isPhotosLoading
      ) {
        this.getPhotos();
      }
    },
  },
  computed: {
    SearchSource: () => SearchSource,
    headerStyle() {
      return {
        backgroundColor: "white",
        ...(this.selectedAlbum ? { top: "15px" } : {}),
      };
    },
    gridContainerStyle() {
      let offsetHeight = this.selectedAlbum ? 210 : 70;

      if (this.selectedPhotos.length) {
        offsetHeight += 50;
      }

      return {
        height: `calc(100% - ${offsetHeight}px)`,
      };
    },
    photoDetailsContainerStyle() {
      let offsetHeight = this.selectedAlbum ? 210 : 75;

      if (this.selectedPhotos.length) {
        offsetHeight += 50;
      }

      return {
        height: `calc(100% - ${offsetHeight}px)`,
        overflow: "auto",
      };
    },
  },
  async mounted() {
    const photoGridContainer = this.$refs["photo-grid-container"];
    photoGridContainer.addEventListener("scroll", this.handleScroll);

    if (!this.photos?.length && !this.selectedAlbum) {
      await this.getPhotos();
    }
  },
  unmounted() {
    const photoGridContainer = this.$refs["photo-grid-container"];
    photoGridContainer.removeEventListener("scroll", this.handleScroll);
  },
  created() {
    window.addEventListener("resize", this.setWindowWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.setWindowWidth);
  },
};
</script>

<style scoped lang="scss">
$md: 768px;
.utd-utilities {
  &__search {
    position: absolute;
    top: 0;
    z-index: 1040;
    padding: 10px;
    background-color: white;
    border: 1px solid #ccc;
    margin: 0 auto;
    width: 100%;
  }

  &__photoDetails-desktop {
    background-color: white;
    position: absolute;
    top: 0;
    right: 0;
    width: 350px;
    z-index: 1100;
    height: 100%;
    border: 1px solid #ccc;
  }

  &__photo-grid {
    .photo-grid-item {
      height: 180px;
    }
  }

  &__photo-viewer {
    overflow: hidden;
    .photo-grid-container {
      overflow: auto;
      overflow-x: hidden;
    }
  }

  &__photo-actions {
    background-color: white;
    position: absolute;
    border-top: 1px solid #ccc;
    bottom: 0;
    z-index: 3;
    padding: 10px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
