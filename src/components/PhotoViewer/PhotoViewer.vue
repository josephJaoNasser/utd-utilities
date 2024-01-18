<template>
  <b-row no-gutters>
    <b-col>
      <b-row cols="3" cols-sm="4" cols-md="5" cols-lg="6" no-gutters>
        <!-- <b-col v-for="photo in photos"></b-col> -->
        <b-col
          v-for="num in 10"
          class="p-2"
          @click="selectedPhoto = num"
          :key="num"
        >
          <div class="test-img-container">
            {{ num }}
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-col v-if="selectedPhoto" cols="4">
      <Preview :photo-details="selectedPhoto" @close="selectedPhoto = null" />
    </b-col>
  </b-row>

  <!-- <Preview /> -->
</template>
<script>
import UTDService from "@/services/UTDService";
import Preview from "./Preview.vue";

export default {
  name: "PhotoPicker",
  components: { Preview },
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
    };
  },
  methods: {
    async getPhotos(token) {
      const UTD = new UTDService(token);
      const photos = await UTD.getPhotos();
    },
  },
  async mounted() {},
};
</script>

<style>
.test-img-container {
  height: 100%;
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid #aaaaaa;
}
</style>
