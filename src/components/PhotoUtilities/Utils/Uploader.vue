<template>
  <b-modal
    v-model="modalShow"
    hide-footer
    hide-header
    centered
    size="lg"
    content-class="p-2 p-md-3"
  >
    <h3 class="mb-4 font-weight-bold">Upload photos</h3>
    <div class="position-absolute" style="right: -30px; top: -30px">
      <b-button variant="danger" @click="modalShow = false">
        <b-icon-x></b-icon-x>
      </b-button>
    </div>
    <div
      ref="dropArea"
      :class="['drop-area', files.length && 'has-image']"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <b-container fluid v-if="files.length">
        <b-row no-gutters cols="2" cols-sm="3" cols-lg="4">
          <b-col
            v-for="fileObj in files"
            class="p-1 p-md-2 position-relative photo-column"
          >
            <b-button
              v-if="isIdle(fileObj)"
              size="sm"
              variant="light"
              class="position-absolute"
              style="top: 15px; right: 15px; z-index: 1;"
              @click="handleFileRemove(fileObj.index)"
            >
              <b-icon-trash></b-icon-trash>
            </b-button>

            <b-overlay :show="!isIdle(fileObj)" class="d-inline-block h-100">
              <template #overlay>
                <div class="text-center">
                  <b-spinner
                    v-if="fileObj.isUploading"
                    small
                    variant="primary"
                  ></b-spinner>

                  <b-icon-check-circle-fill
                    v-else-if="fileObj.isComplete"
                    class="h5 mb-0 text-success"
                  ></b-icon-check-circle-fill>

                  <b-icon-exclamation-circle-fill
                    v-else-if="fileObj.hasError"
                    class="h5 mb-0 text-danger"
                  ></b-icon-exclamation-circle-fill>
                </div>
              </template>
              <b-img-lazy
                blankColor="#bbb"
                :src="getImageFromFile(fileObj.file)"
                :class="[isIdle(fileObj) ? 'img-idle' : '']"
                alt="Uploaded Image"
              />
            </b-overlay>
          </b-col>
          <b-col class="p-1 p-md-2 photo-column">
            <b-container
              fluid
              class="rounded h-100 p-0"
              style="opacity: 0.15; border: 2px solid black"
            >
              <label
                for="utd-utilities__upload-select"
                class="h-100 w-100 cursor-pointer"
              >
                <b-icon-plus class="h-100 w-100"></b-icon-plus>
              </label>
            </b-container>
            <input
              id="utd-utilities__upload-select"
              type="file"
              ref="fileInput"
              accept="image/*"
              multiple
              hidden
              @change="handleFileSelect"
            />
          </b-col>
        </b-row>
      </b-container>
      <div v-else>
        <b-container fluid class="drag-drop-label">
          <b-icon-upload font-scale="5" class="mb-3"></b-icon-upload>
          <h4>Drop files to upload</h4>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            multiple
            @change="handleFileSelect"
          />
        </b-container>
        or
        <div class="text-center mt-2">
          <UTDButton class="cursor-pointer" outline>
            <label
              for="utd-utilities__upload-select"
              class="mb-0 cursor-pointer"
            >
              <b-icon-folder-plus class="mr-2"></b-icon-folder-plus>
              Select files
            </label>
          </UTDButton>
          <input
            id="utd-utilities__upload-select"
            type="file"
            ref="fileInput"
            accept="image/*"
            multiple
            hidden
            @change="handleFileSelect"
          />
        </div>
      </div>
    </div>
    <!-- <div class="mt-3">
      <label for="urlUpload">
        <h5 class="mb-0">Import using image URL</h5>
      </label>
      <p>Insert image by pasting the image URL of the image</p>
      <UTDInput icon="link" />
    </div> -->
    <div class="mt-3">
      <UTDButton @click="handleUpload" :loading="isUploading">
        <b-icon-cloud-arrow-up-fill class="mr-2"></b-icon-cloud-arrow-up-fill>
        Upload
      </UTDButton>
    </div>
  </b-modal>
</template>

<script>
import UTDService from "@/services/UTDService";
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";

export default {
  name: "Uploader",
  props: {
    token: String,
    show: Boolean,
    organizationId: Number,
    accountId: Number,
    albumId: String,
    siteId: String,
  },
  components: { UTDButton, UTDInput },
  emits: ["close", "upload-completed"],
  data() {
    return {
      files: [],
      isUploading: false,
    };
  },
  computed: {
    modalShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.image = null;
        this.handleClose();
      },
    },
  },
  methods: {
    handleDragOver(evt) {
      const dropArea = this.$refs.dropArea;
      dropArea.classList.add("drag-over");
    },
    handleDragLeave(evt) {
      const dropArea = this.$refs.dropArea;
      dropArea.classList.remove("drag-over");
    },
    handleDrop(evt) {
      evt.preventDefault();
      evt.target.classList.remove("drag-over");
      const files = evt.dataTransfer.files;
      this.handleFiles(files);
    },
    handleFileSelect() {
      const fileInput = this.$refs.fileInput;
      const files = fileInput.files;
      this.handleFiles(files);
    },
    handleFileRemove(index) {
      this.files = this.files.filter((fileObj) => fileObj.index !== index);
    },
    getImageFromFile(file) {
      return URL.createObjectURL(file);
    },
    handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.type.startsWith("image/")) {
          this.files.push({
            file,
            index: i,
            isUploading: false,
            isComplete: false,
            hasError: false,
          });
        }
      }
    },
    handleClose() {
      this.files = [];
      this.$emit("close");
    },
    packagePhoto(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", this.organizationId);
      formData.append("accountId", this.accountId);

      return formData;
    },
    isIdle(fileObj) {
      const { isUploading, isComplete, hasError } = fileObj;
      return !isUploading && !isComplete && !hasError;
    },

    async handleUpload() {
      this.isUploading = true;

      for (let i = 0; i < this.files.length; i++) {
        this.files[i].isUploading = true;
      }

      try {
        const UTD = new UTDService(this.token);
        const photos = this.files.map((fileObj) => ({
          file: this.packagePhoto(fileObj.file),
          index: fileObj.index,
        }));

        const onUploadComplete = (data, index) => {
          this.$emit("upload-completed", data.payload);

          const fileIndex = this.files.findIndex(
            (fileObj) => fileObj.index === index
          );
          this.files[fileIndex].isUploading = false;

          if (data.success) {
            this.files[fileIndex].isComplete = true;
          } else {
            this.files[fileIndex].hasError = true;
          }
        };

        if (this.albumId) {
          const uploadPromises = photos.map((photoObj) =>
            UTD.addAlbumPhotos({
              accountId: this.accountId,
              albumId: this.albumId,
              photos: [photoObj.file],
              siteId: this.siteId,
            })
              .then((data) => onUploadComplete(data[0], photoObj.index))
              .catch((err) => onUploadComplete({ succes: false }))
          );

          await Promise.all(uploadPromises);
        } else {
          const uploadPromises = photos.map((photoObj) =>
            UTD.uploadSingleFile(photoObj.file)
              .then((data) => onUploadComplete(data, photoObj.index))
              .catch((err) => onUploadComplete({ succes: false }))
          );

          await Promise.all(uploadPromises);
        }

        setTimeout(() => {
          this.handleClose();
        }, 700);
      } catch (e) {
        console.log(e);
      }
      this.isUploading = false;
    },
  },
};
</script>

<style scoped lang="scss">
$primary: #2a99d6;
.drop-area {
  border: 3px dashed #ccc;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;

  .drag-drop-label {
    color: #555;
  }

  &.drag-over {
    border-color: $primary;
    .drag-drop-label {
      color: $primary;
    }
  }

  &:not(.has-image) {
    padding: 2rem;
  }

  &.has-image {
    padding: 0px;
  }

  .photo-column {
    aspect-ratio: 1;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 8px;

    &:not(.img-idle) {
      cursor: default;
      opacity: 0.4;
    }
  }
}
</style>
