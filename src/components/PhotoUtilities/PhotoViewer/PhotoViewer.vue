<template>
  <b-row class="position-relative">
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
    <b-container fluid >
      <b-row>
        <b-container fluid class="text-center mb-3 p-4" v-if="isPhotosLoading">
          <b-spinner
            label="Loading..."
            variant="primary"
            type="grow"
          ></b-spinner>
        </b-container>
        <b-col order="2" order-sm="1" v-else class="mt-4">
          <b-container fluid v-if="!photos.length">
            <p class="text-center p-4">
              <i> No photos to show... </i>
            </p>
          </b-container>
          <b-row
            class="utd-utilities__photo-grid"
            cols="3"
            :cols-sm="!selectedPhoto ? 4 : 2"
            :cols-md="!selectedPhoto ? 4 : 3"
            :cols-lg="!selectedPhoto ? 5 : 4"
            :cols-xl="!selectedPhoto ? 6 : 5"
            no-gutters
          >
            <b-col
              v-for="photo in filteredPhotos"
              class="p-1 p-md-2"
              @click="selectedPhoto = photo"
              :key="photo.id"
            >
              <PhotoListItem
                :thumbnail-url="
                  photo.thumbnail?.length ? photo.thumbnail : photo.url
                "
                :active="!!selectedPhoto && selectedPhoto.id === photo.id"
                @edit-click="onPhotoEdit(photo.id)"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col
          v-if="selectedPhoto"
          cols="12"
          sm="6"
          md="5"
          lg="4"
          xl="3"
          order="1"
          order-sm="2"
          class="mb-3 p-0 border-left"
        >
          <PhotoDetails
            v-if="!isPhotosLoading"
            class="utd-utilities__photoDetails mt-3"
            :source="source"
            :photo-details="selectedPhoto"
            @close="selectedPhoto = null"
            @photo-selected="onSelect"
          />
        </b-col>
      </b-row>
    </b-container>
    <!-- <EditPhoto
      :show="!!editingPhoto"
      :source="source"
      :photo-details="editingPhoto"
      @close="editingPhoto = null"
      @photo-selected="onSelect"
    /> -->
  </b-row>
</template>
<script>
import UTDService from "@/services/UTDService";
import PhotoDetails from "./PhotoDetails.vue";
import PhotoListItem from "./PhotoListItem.vue";
import UTDInput from "@/components/UTDInput";
import EditPhoto from "./EditPhoto.vue";

export default {
  name: "PhotoPicker",
  components: { PhotoDetails, PhotoListItem, UTDInput, EditPhoto },
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
      editingPhoto: null,
      isPhotosLoading: false,
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
  },
  methods: {
    async getPhotos() {
      this.isPhotosLoading = true;
      try {
        const UTD = new UTDService(this.token);
        const { rows, count } = await UTD.getPhotos({
          accountId: this.accountId,
        });
        this.photos = rows;
        this.$emit("load", this.photos);
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },

    onSelect(e) {
      this.$emit("photo-selected", e);
    },

    onPhotoEdit(photoId) {
      this.editingPhoto = this.photos.find((photo) => photo.id == photoId);
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
  @media screen and (min-width: $md) {
    &__photo-grid {
      // max-height: 700px;
      // overflow: auto;
    }
  }
}
</style>
