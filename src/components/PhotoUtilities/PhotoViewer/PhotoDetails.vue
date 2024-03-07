<template>
  <b-container fluid class="utd-utilities__photo-preview p-0">
    <div class="mb-3 px-3 d-flex justify-content-between">
      <UTDButton
        @click="onClose"
        class="utd-utilities__back-button"
        type="light"
      >
        <b-icon-chevron-left></b-icon-chevron-left>
      </UTDButton>
      <UTDButton
        @click="onSave"
        class="utd-utilities__select-button"
        type="primary"
      >
        <b-icon-check></b-icon-check>
        <span class="d-none d-sm-inline-block"> Save changes </span>
      </UTDButton>
    </div>

    <PhotoWindow
      class="mb-3 p-0"
      :url="photoDetails.url"
      max-height="250"
      background-color="#eee"
    />

    <b-container v-if="source !== 'ai'" fluid class="px-3">
      <div class="mb-3">
        <label class="mb-1" for="title">Title</label>
        <b-form-input
          type="text"
          name="title"
          v-model="fileName"
        ></b-form-input>
      </div>

      <div class="mb-3">
        <label class="mb-1" for="caption">Caption</label>
        <b-form-input
          type="text"
          name="caption"
          v-model="caption"
        ></b-form-input>
      </div>

      <div class="mb-3">
        <label class="mb-1" for="description">Description</label>
        <b-form-textarea
          no-resize
          rows="4"
          type="text"
          name="description"
          v-model="description"
        ></b-form-textarea>
      </div>

      <div class="mb-3">
        <label class="mb-1" for="file-url">File URL</label>
        <b-form-input
          type="text"
          name="file-url"
          v-model="url"
          disabled
        ></b-form-input>
      </div>
    </b-container>
  </b-container>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import PhotoWindow from "../components/PhotoWindow.vue";

export default {
  name: "PhotoDetails",
  components: { UTDButton, PhotoWindow },
  props: {
    photoDetails: Object,
    source: {
      type: String,
      default: "all",
    },
  },
  emits: ["photo-saved"],
  data() {
    const { fileName, url } = this.photoDetails;
    return {
      fileName,
      url,
      caption: "",
      description: "",
    };
  },
  methods: {
    onClose() {
      this.$emit("close");
    },

    onSave() {
      // create a request for saving the photo details
    },
  },
  watch: {
    photoDetails: {
      deep: true,
      immediate: true,
      handler(newData) {
        const { fileName, url } = newData;
        this.fileName = fileName;
        this.url = url;
      },
    },
  },
};
</script>

<style scoped lang="scss">
.utd-utilities {
  // &__photo-preview {
  //   background-color: rgb(0, 0, 0, 0.05);
  // }

  &__back-button {
    border: none;
  }
}
</style>
../components/PhotoWindow.vue
