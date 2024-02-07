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
          class="p-1 p-sm-2 mb-3"
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
            <b-container fluid class="py-2">
              <UTDPagination
                :page="currentPage"
                :total-items="totalItems"
                @page-change="
                  (e) => {
                    currentPage = e;
                    getPhotos(e);
                  }
                "
              />
            </b-container>
          </b-row>

          <b-container fluid v-if="!photos.length">
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
              v-for="photo in filteredPhotos"
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
            <b-container fluid class="py-2">
              <UTDPagination
                :page="currentPage"
                :total-items="totalItems"
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

const PHOTO_PAGINATION_LIMIT = 25;

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
    defaultPhotos: {
      type: Array,
      default: () => [],
    },
    query: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["load", "photo-selected"],
  data() {
    return {
      photos: this.defaultPhotos,
      selectedPhoto: null,
      showEditSection: false,
      isPhotosLoading: false,
      currentPage: 1,
      totalItems: 1,
      itemsPerPage: PHOTO_PAGINATION_LIMIT,
      searchString: "",
    };
  },
  computed: {
    filteredPhotos() {
      if (!this.searchString.length) {
        return this.photos;
      }
      const searchLowerCase = this.searchString.toLowerCase();

      const filteredList = this.photos.filter((photo) =>
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
      const offsetHeight = this.selectedPhoto ? "200px" : "150px";
      return {
        height: `calc(100% - ${offsetHeight})`,
      };
    },
  },
  methods: {
    async getPhotos(page) {
      this.isPhotosLoading = true;
      try {
        const UTD = new UTDService(this.token);
        const { rows, totalPages, count } = await UTD.getPhotos({
          accountId: this.accountId,
          limit: PHOTO_PAGINATION_LIMIT,
          page: page || this.currentPage,
        });

        this.totalItems = count;
        this.photos = rows;
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
  watch: {
    defaultPhotos: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.photos = newVal;
      },
    },
  },
  async mounted() {
    if (!this.defaultPhotos.length && this.source === "all") {
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
      height: calc(100% - 200px);
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
