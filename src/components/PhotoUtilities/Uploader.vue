<template>
  <b-modal v-model="modalShow" title="Upload photos" hide-footer>
    <div
      :class="['drop-area', image && 'has-image']"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <img v-if="image" :src="image" alt="Uploaded Image" />
      <div v-else>
        <div>
          <h4>Drop files to upload</h4>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileSelect"
          />
        </div>
        or
        <div class="text-center">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleFileSelect"
          />
        </div>
      </div>
    </div>
    <div class="mt-3">
      <label for="urlUpload">
        <h5 class="mb-0">Import using image URL</h5>
      </label>
      <p>Insert image by pasting the image URL of the image</p>
      <UTDInput icon="link" />
    </div>
    <div class="mt-3">
      <UTDButton @click="handleUpload">Upload</UTDButton>
    </div>
  </b-modal>
</template>

<script>
import UTDService from "@/services/UTDService";
import UTDButton from "../UTDButton";
import UTDInput from "../UTDInput";

export default {
  name: "UploadPhotos",
  props: {
    token: String,
    show: Boolean,
  },
  components: { UTDButton, UTDInput },
  emits: ["close"],
  data() {
    return {
      image: null,
      file: null,
    };
  },
  computed: {
    modalShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.image = null;
        this.$emit("close");
      },
    },
  },
  methods: {
    handleDragOver(evt) {
      evt.target.classList.add("drag-over");
    },
    handleDragLeave(evt) {
      evt.target.classList.remove("drag-over");
    },
    handleDrop(evt) {
      evt.preventDefault();
      evt.target.classList.remove("drag-over");
      const file = evt.dataTransfer.files[0];
      this.handleFile(file);
    },
    handleFileSelect() {
      const fileInput = this.$refs.fileInput;
      const file = fileInput.files[0];
      this.handleFile(file);
    },
    handleFile(file) {
      if (file && file.type.startsWith("image/")) {
        this.image = URL.createObjectURL(file);
        this.file = file;
      } else {
        this.image = null;
      }
    },
    async handleUpload() {
      try {
        const formData = new FormData();
        formData.append("file", this.file);
        const UTD = new UTDService(this.token);
        const res = await UTD.uploadFile(formData);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.drop-area {
  border: 2px dashed #ccc;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;

  &:not(.has-image) {
    padding: 2rem;
  }

  &.has-image {
    padding: 10px;
  }

  img {
    height: 100%;
    width: 100%;
  }
}

.drag-over {
  border-color: #2a99d6;
}
</style>
