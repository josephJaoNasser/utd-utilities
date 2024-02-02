<template>
  <b-container fluid class="p-4 rounded utd-utilities__photo-preview">
    <div class="mb-4 d-flex justify-content-between">
      <UTDButton
        @click="onClose"
        class="utd-utilities__back-button"
        type="light"
      >
        <b-icon-chevron-left></b-icon-chevron-left>
      </UTDButton>
      <UTDButton
        @click="onSelect"
        class="utd-utilities__select-button"
        type="primary"
      >
        <b-icon-plus></b-icon-plus>
        Select photo
      </UTDButton>
    </div>

    <PhotoWindow :url="photoDetails.url" max-height="250" borders />

    <b-container v-if="source !== 'ai'" fluid class="p-0">
      <b-row align-v="center" class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="title">Title</label>
        </b-col>
        <b-col cols="8">
          <b-form-input
            type="text"
            name="title"
            v-model="fileName"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row align-v="center" class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="caption">Caption</label>
        </b-col>
        <b-col cols="8">
          <b-form-input
            type="text"
            name="caption"
            v-model="caption"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="description">Description</label>
        </b-col>
        <b-col cols="8">
          <b-form-textarea
            no-resize
            rows="4"
            type="text"
            name="description"
            v-model="description"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row align-v="center" class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="file-url">File URL</label>
        </b-col>
        <b-col cols="8">
          <b-form-input
            type="text"
            name="file-url"
            v-model="url"
          ></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import PhotoWindow from "../Utils/PhotoWindow.vue";

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
  emits: ["photo-selected"],
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

    onSelect() {
      this.$emit("photo-selected", this.photoDetails);
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
  &__photo-preview {
    background-color: rgb(0, 0, 0, 0.05);
  }

  &__back-button {
    border: none;
  }
}
</style>
