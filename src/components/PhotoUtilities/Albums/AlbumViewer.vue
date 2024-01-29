<template>
  <div>
    <b-container fluid class="p-0 mb-3">
      <UTDButton @click="$emit('back')" type="light" class="mb-3">
        <b-icon-chevron-left></b-icon-chevron-left>
        Back to albums
      </UTDButton>
      <div class="card bg-dark text-white border-0 utd-utilities__album-cover">
        <div class="position-relative img-container">
          <div class="album-bg-overlay absolute"></div>
          <img class="card-img" :src="selectedAlbum.image" />
        </div>
        <div class="card-img-overlay p-0">
          <div class="card-body h-100">
            <h4 class="card-title">
              {{
                selectedAlbum.title.length
                  ? selectedAlbum.title
                  : "Untitled Album"
              }}
            </h4>
            <p class="card-text">
              {{ selectedAlbum.description }}
            </p>
            <p class="card-text">
              {{ formattedGallery.length }}
              {{ formattedGallery.length === 1 ? "photo" : "photos" }}
            </p>
          </div>
        </div>
      </div>
    </b-container>
    <PhotoViewer
    class="pt-5"
      :token="token"
      :default-photos="formattedGallery"
      :source="'album'"
      @photo-selected="onSelect"
    />
  </div>
</template>

<script>
import UTDService from "@/services/UTDService";
import UTDButton from "@/components/UTDButton";
import PhotoViewer from "../PhotoViewer";

export default {
  name: "AlbumViewer",
  components: { PhotoViewer, UTDButton },
  props: {
    token: String,
    selectedAlbum: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["photo-selected", "back"],
  data() {
    return {
      photos: [],
    };
  },
  methods: {
    async getAlbumPhotos() {
      try {
        const UTD = new UTDService(this.token);
      } catch (e) {
        console.log(e);
      }
    },

    onSelect(e) {
      this.$emit("photo-selected", e);
    },
  },
  computed: {
    formattedGallery() {
      return this.selectedAlbum.gallery.map((image, index) => ({
        id: index,
        fileName: image.fileName,
        thumbnail: image.imageThumbnail,
        url: image.image,
      }));
    },
  },
  async mounted() {
    await this.getAlbumPhotos();
  },
};
</script>

<style scoped lang="scss">
.utd-utilities {
  &__album-cover {
    overflow: hidden;
    & > .img-container {
      height: 100%;

      .album-bg-overlay {
        background-image: linear-gradient(
          to bottom,
          rgba(245, 246, 252, 0),
          rgba(0, 0, 0, 0.73)
        );
        height: 100%;
        width: 100%;
        position: absolute;
      }

      img {
        height: 200px;
        object-fit: cover;
        object-position: center center;
      }
    }

    .card-body {
      display: flex;
      flex-direction: column;
      justify-content: end;
    }
  }
}
</style>
