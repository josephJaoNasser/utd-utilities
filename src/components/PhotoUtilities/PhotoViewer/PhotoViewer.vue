<template>
  <b-row>
    <b-container>
      <b-row class="mb-4">
        <b-col>
          <UTDInput
            v-model="searchString"
            icon="search"
            class="p-2"
            placeholder="Type to search"
          />
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col v-if="isPhotosLoading">Loading...</b-col>
        <b-col>
          <b-row
            cols="3"
            :cols-md="!selectedPhoto ? 4 : 2"
            :cols-lg="!selectedPhoto ? 5 : 3"
            no-gutters
          >
            <!-- <b-col v-for="photo in photos"></b-col> -->
            <b-col
              v-for="photo in filteredPhotos"
              class="p-2"
              @click="selectedPhoto = photo"
              :key="photo.id"
            >
              <PhotoListItem
                :thumbnail-url="photo.thumbnail"
                :active="!!selectedPhoto && selectedPhoto.id === photo.id"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col v-if="selectedPhoto" cols="12" md="6" lg="5">
          <Preview
            v-if="!isPhotosLoading"
            :photo-details="selectedPhoto"
            @close="selectedPhoto = null"
          />
        </b-col>
      </b-row>
    </b-container>
  </b-row>

  <!-- <Preview /> -->
</template>
<script>
import UTDService from "@/services/UTDService";
import Preview from "./Preview.vue";
import PhotoListItem from "./PhotoListItem.vue";
import UTDInput from "@/components/UTDInput";

export default {
  name: "PhotoPicker",
  components: { Preview, PhotoListItem, UTDInput },
  props: {
    token: String,
    query: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      photos: [],
      selectedPhoto: null,
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
  },
  methods: {
    async getPhotos(token) {
      this.isPhotosLoading = true;
      try {
        const UTD = new UTDService(token);
        const { rows, count } = await UTD.getPhotos();
        this.photos = rows;
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },
  },
  async mounted() {
    await this.getPhotos(this.token);
  },
};
</script>
