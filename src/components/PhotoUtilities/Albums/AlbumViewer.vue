<template>
  <b-container fluid class="utd-utilities__album-viewer pt-3 px-0">
    <b-container fluid>
      <div class="d-flex justify-content-between">
        <UTDButton @click="$emit('back')" type="light" class="mb-3">
          <b-icon-chevron-left></b-icon-chevron-left>
          Back
        </UTDButton>
        <div>
          <UTDButton type="light" class="mb-3 mr-2">
            <b-icon-gear></b-icon-gear>
            Album Settings
          </UTDButton>
          <UTDButton @click="showUploader = true" type="primary" class="mb-3">
            <b-icon-plus></b-icon-plus>
            Add photos
          </UTDButton>
        </div>
      </div>

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
              {{ formattedGallery.length }}
              {{ formattedGallery.length === 1 ? "photo" : "photos" }}
            </p>
          </div>
        </div>
      </div>
    </b-container>
    <b-container fluid class="text-center mb-3 p-4" v-if="isPhotosLoading">
      <b-spinner label="Loading..." variant="primary" type="grow"></b-spinner>
    </b-container>
    <b-container v-else fluid class="photo-viewer-container p-0">
      <PhotoViewer
        :token="token"
        :photos="paginatedGallery"
        :selected-album="selectedAlbum"
        :source="'album'"
        @photo-selected="onSelect"
      />
    </b-container>
    <Uploader
      :token="token"
      :show="showUploader"
      :account-id="accountId"
      :organization-id="organizationId"
      site-id="ef6c9ff73237e166d797df0b8ded24f5"
      :album-id="selectedAlbum.encryptedId"
      @close="showUploader = false"
      @upload-completed="handleUploadComplete"
    />
  </b-container>
</template>

<script>
import UTDService from "@/services/UTDService";
import UTDButton from "@/components/UTDButton";
import PhotoViewer from "../PhotoViewer";
import Uploader from "../Utils/Uploader.vue";

const SITE_ID_REMOVE_DURING_PRACTICAL = "ef6c9ff73237e166d797df0b8ded24f5";

export default {
  name: "AlbumViewer",
  components: { PhotoViewer, UTDButton, Uploader },
  props: {
    token: String,
    accountId: Number,
    organizationId: Number,
    selectedAlbum: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["photo-selected", "back"],
  data() {
    return {
      showUploader: false,
      isPhotosLoading: false,
      gallery: [],
    };
  },
  methods: {
    async getAlbumPhotos() {
      this.isPhotosLoading = true;
      try {
        const UTD = new UTDService(this.token);
        const albumData = await UTD.getAlbumGallery(
          this.selectedAlbum.encryptedId,
          SITE_ID_REMOVE_DURING_PRACTICAL
        );

        this.gallery = albumData.payload || [];
      } catch (e) {
        console.log(e);
      }
      this.isPhotosLoading = false;
    },

    handleUploadComplete(newPhotos) {
      if (!Array.isArray(newPhotos)) {
        this.gallery.unshift(newPhotos);
        return;
      }

      for (const photo of newPhotos) {
        this.gallery.unshift(photo);
      }
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
        thumbnail: image.imageThumbnail,
        url: image.image,
      }));
    },
    paginatedGallery() {
      const ITEMS_PER_PAGE = 25;
      const totalItems = this.formattedGallery.length;
      const gallery = {
        totalItems: totalItems,
      };

      const pages = [];
      for (let i = 0; i < this.formattedGallery.length; i += ITEMS_PER_PAGE) {
        pages.push(this.formattedGallery.slice(i, i + ITEMS_PER_PAGE));
      }

      pages.forEach((chunk, index) => {
        gallery[index + 1] = chunk;
      });

      return gallery;
    },
  },
  async mounted() {
    await this.getAlbumPhotos();
  },
};
</script>

<style scoped lang="scss">
.photo-viewer-container {
  height: calc(100% - 215px);
}

.utd-utilities {
  &__album-viewer {
    height: 100%;
  }

  &__album-cover {
    overflow: hidden;
    height: 160px;
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
