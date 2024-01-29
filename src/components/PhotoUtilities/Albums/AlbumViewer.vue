<template>
  <div>
    <b-container fluid class="p-0 mb-3">
      <div class="card bg-dark text-white border-0 utd-utilities__album-cover">
        <div class="position-relative img-container">
          <div class="album-bg-overlay absolute"></div>
          <img class="card-img" :src="selectedAlbum.albumImage" />
        </div>
        <div class="card-img-overlay p-0">
          <div class="card-body h-100">
            <h4 class="card-title">
              {{
                selectedAlbum.albumName.length
                  ? selectedAlbum.albumName
                  : "Untitled Album"
              }}
            </h4>
            <p class="card-text">
              {{ selectedAlbum.albumDescription }}
            </p>
            <p class="card-text">
              {{ photos.length }}
              {{ photos.length === 1 ? "photo" : "photos" }}
            </p>
          </div>
        </div>
      </div>
    </b-container>
    <PhotoViewer
      :token="token"
      :default-photos="photos"
      :source="'album'"
      @photo-selected="onSelect"
    />
  </div>
</template>

<script>
import UTDService from "@/services/UTDService";
import PhotoViewer from "../PhotoViewer";

export default {
  name: "AlbumViewer",
  components: { PhotoViewer },
  props: {
    token: String,
    selectedAlbum: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["photo-selected"],
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
