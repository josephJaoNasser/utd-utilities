<template>
  <b-container fluid class="utd-utilities__album-viewer px-0">
    <b-container fluid class="text-center mb-3 p-4" v-if="isPhotosLoading">
      <b-spinner label="Loading..." variant="primary" type="grow"></b-spinner>
    </b-container>
    <b-container v-else fluid class="photo-viewer-container p-0">
      <PhotoViewer
        :utd-credentials="utdCredentials"
        :photos="formattedGallery"
        :selected-album="selectedAlbum"
        :multi-select="multiSelect"
        @photo-selected="onSelect"
        @album-image-updated="handleAlbumImageUpdate"
      >
        <template #header>
          <div
            class="card bg-dark text-white border-0 utd-utilities__album-cover mb-3"
          >
            <div class="position-relative img-container">
              <div class="album-bg-overlay absolute"></div>
              <img class="card-img" :src="albumImage" />
            </div>
            <div class="card-img-overlay p-0">
              <div class="card-body h-100 p-0">
                <div class="d-flex justify-content-between p-3">
                  <div class="w-80">
                    <h4 class="card-title">
                      {{
                        selectedAlbum.albumName?.length
                          ? selectedAlbum.albumName
                          : "Untitled Album"
                      }}
                    </h4>
                    <p class="card-text album-description">
                      {{ selectedAlbum.albumDescription }}
                    </p>
                    <p class="card-text">
                      {{ formattedGallery.length }}
                      {{ formattedGallery.length === 1 ? "photo" : "photos" }}
                    </p>
                  </div>
                  <div class="d-flex align-items-end">
                    <UTDButton
                      type="light"
                      class="mr-2"
                      @click="showAlbumSettings = true"
                    >
                      <b-icon-gear></b-icon-gear>
                      <!-- <span class="d-none d-sm-inline-block"> Settings </span> -->
                    </UTDButton>
                    <UTDButton @click="showUploader = true" type="primary">
                      <b-icon-plus></b-icon-plus>
                      <!-- <span class="d-none d-sm-inline-block">
                          Add photos
                        </span> -->
                    </UTDButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </PhotoViewer>
    </b-container>
    <Uploader
      :show="showUploader"
      :utd-credentials="utdCredentials"
      :site-id="SITE_ID_REMOVE_DURING_PRODUCTION"
      :album-id="selectedAlbum.encryptedId"
      @close="showUploader = false"
      @upload-completed="handleUploadComplete"
    />
    <AlbumSettingsModal
      :show="showAlbumSettings"
      :utd-credentials="utdCredentials"
      :album-details="selectedAlbum"
      @album-updated="handleAlbumDetailsUpdate"
      @close="showAlbumSettings = false"
    />
  </b-container>
</template>

<script>
import PhotoService from "@/services/PhotoService";
import UTDButton from "@/components/UTDButton";
import PhotoViewer from "../PhotoViewer";
import Uploader from "../components/Uploader.vue";
import AlbumSettingsModal from "./AlbumSettingsModal.vue";

const SITE_ID_REMOVE_DURING_PRODUCTION = "ef6c9ff73237e166d797df0b8ded24f5";

export default {
  name: "AlbumViewer",
  components: { PhotoViewer, UTDButton, Uploader, AlbumSettingsModal },
  props: {
    utdCredentials: Object,
    multiSelect: Boolean,
    selectedAlbum: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["photo-selected", "back", "album-details-updated"],
  data() {
    return {
      showUploader: false,
      isPhotosLoading: false,
      showAlbumSettings: false,
      gallery: [],
      albumImage: this.selectedAlbum?.albumImage || null,
    };
  },
  methods: {
    async getAlbumPhotos() {
      this.isPhotosLoading = true;
      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const albumData = await UTD.getAlbumGallery(
          this.selectedAlbum.encryptedId,
          SITE_ID_REMOVE_DURING_PRODUCTION
        );

        this.gallery = albumData.payload || [];
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },

    async setAlbumImage(url) {
      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const res = await UTD.editAlbum(this.selectedAlbum.id.toString(), {
          albumImage: url,
        });

        if (res.success) {
          this.handleAlbumImageUpdate(url);
        }
      } catch (e) {
        console.log(e);
      }
    },

    handleUploadComplete(newPhotos) {
      if (!Array.isArray(newPhotos)) {
        this.gallery.unshift(newPhotos);

        if (this.selectedAlbum && !this.selectedAlbum.albumImage) {
          this.setAlbumImage(newPhotos.image);
          this.handleAlbumImageUpdate(newPhotos.image);
        }

        return;
      }

      for (const photo of newPhotos) {
        this.gallery.unshift(photo);
      }

      if (this.selectedAlbum && !this.selectedAlbum.albumImage) {
        this.setAlbumImage(newPhotos[0].image);
        this.handleAlbumImageUpdate(newPhotos[0].image);
      }
    },

    handleAlbumDetailsUpdate(albumDetails) {
      const { albumName, albumDescription, albumImage } = albumDetails;
      this.$emit("album-details-updated", {
        albumName,
        albumDescription,
        albumImage,
      });
    },

    handleAlbumImageUpdate(url) {
      this.albumImage = url;
      this.handleAlbumDetailsUpdate({
        albumName: this.selectedAlbum.albumName,
        albumDescription: this.selectedAlbum.albumDescription,
        albumImage: url,
      });
    },

    onSelect(e) {
      this.$emit("photo-selected", e);
    },
  },
  computed: {
    formattedGallery() {
      return this.gallery.map((image, index) => ({
        id: index,
        fileName: image.fileName,
        thumbnail: image.imageThumbnail || image.thumbnail,
        url: image.image,
      }));
    },

    SITE_ID_REMOVE_DURING_PRODUCTION() {
      return SITE_ID_REMOVE_DURING_PRODUCTION;
    },
  },
  async mounted() {
    await this.getAlbumPhotos();
  },
};
</script>

<style scoped lang="scss">
.photo-viewer-container {
  height: 100%;
}

.utd-utilities {
  &__album-viewer {
    height: 100%;
  }

  &__album-cover {
    overflow: hidden;
    height: 175px;
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

    .album-description {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      width: 80%;
    }
  }
}
</style>
