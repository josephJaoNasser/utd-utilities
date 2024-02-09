<template>
  <b-row class="utd-utilities__photo-viewer position-relative h-100">
    <b-container
      fluid
      :class="['sticky-top border-bottom', source === 'all' ? 'pt-4' : '']"
      :style="headerStyle"
    >
      <div class="mb-3" v-if="source === 'all'">
        <h2 class="font-weight-bold">Photos</h2>
      </div>
      <div fluid v-if="source !== 'ai'">
        <UTDInput
          v-model="searchString"
          icon="search"
          class="p-1 mb-3"
          placeholder="Type to search"
        />
        <!-- <b-row class="mb-4">
          <b-col cols="12" md="6" lg="7">
            <UTDInput
              v-model="searchString"
              icon="search"
              class="p-1 p-sm-2"
              placeholder="Type to search"
            />
          </b-col>
          <b-col></b-col>
        </b-row> -->
      </div>
    </b-container>

    <b-container fluid class="h-100">
      <b-row class="h-100">
        <b-container fluid class="text-center mb-3 p-4" v-if="isPhotosLoading">
          <b-spinner
            label="Loading..."
            variant="primary"
            type="grow"
          ></b-spinner>
        </b-container>

        <!-- Photo grid column -->
        <b-col
          v-else
          order="2"
          order-sm="1"
          class="photo-grid-container"
          :style="gridContainerStyle"
        >
          <b-row>
            <b-container fluid class="py-2 mb-3 border-bottom">
              <UTDPagination
                :page="currentPage"
                :total-items="totalItems"
                :per-page="itemsPerPage"
                @page-change="
                  (e) => {
                    currentPage = e;
                    getPhotos(e);
                  }
                "
              />
            </b-container>
          </b-row>

          <b-container fluid v-if="!photos?.[currentPage]?.length">
            <p class="text-center p-4">
              <i> No photos to show... </i>
            </p>
          </b-container>

          <b-row
            class="utd-utilities__photo-grid"
            style="overflow: auto"
            cols="3"
            :cols-sm="!showEditSection ? 4 : 2"
            :cols-md="!showEditSection ? 4 : 3"
            :cols-lg="!showEditSection ? 5 : 4"
            :cols-xl="!showEditSection ? 6 : 5"
            no-gutters
          >
            <b-col
              v-for="photo in filteredPhotos.length
                ? filteredPhotos
                : photos[currentPage]"
              class="p-1"
              @click="selectedPhoto = photo"
              :key="photo.id"
            >
              <PhotoListItem
                :thumbnail-url="
                  photo.thumbnail?.length ? photo.thumbnail : photo.url
                "
                :active="!!selectedPhoto && selectedPhoto.id === photo.id"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-container fluid class="py-2 mb-2 mt-2 border-top">
              <UTDPagination
                :page="currentPage"
                :total-items="totalItems"
                :per-page="itemsPerPage"
                @page-change="
                  (e) => {
                    currentPage = e;
                    getPhotos(e);
                  }
                "
              />
            </b-container>
          </b-row>
        </b-col>

        <!-- edit section column -->
        <b-col
          v-if="showEditSection"
          cols="12"
          sm="6"
          md="5"
          lg="4"
          xl="3"
          order="1"
          order-sm="2"
          class="p-0 pt-3 border-left photo-details-container"
        >
          <PhotoDetails
            v-if="!isPhotosLoading"
            class="utd-utilities__photoDetails"
            :source="source"
            :photo-details="selectedPhoto"
            @close="showEditSection = false"
            @photo-selected="onSelect"
          />
        </b-col>
      </b-row>
    </b-container>

    <b-container
      v-if="selectedPhoto"
      fluid
      class="utd-utilities__photo-actions"
    >
      <UTDButton
        type="light"
        size="sm"
        class="mr-2"
        @click="
          () => {
            selectedPhoto = null;
            showEditSection = false;
          }
        "
      >
        <b-icon-chevron-left class="mr-1"></b-icon-chevron-left>
        Cancel
      </UTDButton>
      <UTDButton type="light" size="sm" class="mr-2" @click="toggleEditSection">
        <b-icon-pencil class="mr-1"></b-icon-pencil>
        Edit details
      </UTDButton>
      <UTDButton size="sm" @click="onSelect">
        <b-icon-plus class="mr-1"></b-icon-plus>
        Add to page
      </UTDButton>
    </b-container>
  </b-row>
</template>
<script>
import UTDService from "@/services/UTDService";
import PhotoDetails from "./PhotoDetails.vue";
import PhotoListItem from "./PhotoListItem.vue";
import UTDInput from "@/components/UTDInput";
import EditPhoto from "./EditPhoto.vue";
import UTDPagination from "@/components/UTDPagination";
import UTDButton from "@/components/UTDButton";
import { PHOTOS_PER_PAGE } from "@/constants/PaginationVariables";

export default {
  name: "PhotoPicker",
  components: {
    PhotoDetails,
    PhotoListItem,
    UTDInput,
    EditPhoto,
    UTDPagination,
    UTDButton,
  },
  props: {
    token: String,
    accountId: Number,
    organizationId: Number,
    source: {
      type: String,
      default: "all",
    },
    // defaultPhotos: {
    //   type: Object,
    //   default: () => {},
    // },
    photos: {
      type: Object,
      default: () => {},
    },
    query: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["load", "photo-selected"],
  model: {
    prop: "photos",
    event: "load",
  },
  data() {
    return {
      // photos: this.defaultPhotos,
      selectedPhoto: null,
      showEditSection: false,
      isPhotosLoading: false,
      currentPage: 1,
      totalItems: this.photos.totalItems,
      itemsPerPage: PHOTOS_PER_PAGE,
      searchString: "",
    };
  },
  methods: {
    async getPhotos(page) {
      this.isPhotosLoading = true;
      const pageToFetch = page || this.currentPage;

      if (this.photos[pageToFetch]?.length) {
        this.isPhotosLoading = false;
        return;
      }

      try {
        const UTD = new UTDService(this.token);
        const { rows, totalPages, count } = await UTD.getPhotos({
          accountId: this.accountId,
          limit: this.itemsPerPage,
          page: pageToFetch,
        });

        this.totalItems = count;
        this.photos[pageToFetch] = rows;
        this.photos.totalItems = count;
        this.$emit("load", this.photos);
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },

    onSelect() {
      this.$emit("photo-selected", this.selectedPhoto);
    },

    toggleEditSection() {
      this.showEditSection = !this.showEditSection;
    },
  },
  computed: {
    filteredPhotos() {
      let photos = [];

      if (this.photos[this.currentPage]) {
        photos = this.photos[this.currentPage];
      }

      if (!this.searchString.length && this.photos[this.currentPage]) {
        return [];
      }

      const searchLowerCase = this.searchString.toLowerCase();

      const filteredList = photos.filter((photo) =>
        photo.fileName.toLowerCase().includes(searchLowerCase)
      );

      return filteredList;
    },
    headerStyle() {
      return {
        backgroundColor: "white",
        ...(this.source !== "all" ? { top: "15px" } : {}),
      };
    },
    gridContainerStyle() {
      const offsetHeight = this.selectedPhoto ? "190px" : "140px";
      return {
        height: `calc(100% - ${offsetHeight})`,
      };
    },
  },
  async mounted() {
    if (!this.photos[this.currentPage]?.length && this.source === "all") {
      await this.getPhotos();
    }
  },
};
</script>

<style scoped lang="scss">
$md: 768px;
.utd-utilities {
  &__photo-viewer {
    .photo-grid-container {
      overflow: auto;
    }

    .photo-details-container {
      height: calc(100% - 190px);
      overflow: auto;
    }
  }

  &__photo-actions {
    background-color: white;
    position: sticky;
    border-top: 1px solid #ccc;
    bottom: 0;
    z-index: 3;
    padding: 10px;
    text-align: right;
  }
}
</style>
