<template>
  <b-container
    fluid
    class="p-4 rounded utd-utilities__photo-preview"
    style="background-color: rgb(0, 0, 0, 0.05)"
  >
    <div class="mb-4">
      <UTDButton
        @click="onClose"
        class="utd-utilities__back-button"
        type="light"
      >
        <b-icon-chevron-left></b-icon-chevron-left>
      </UTDButton>
    </div>
    <b-container
      class="position-relative mb-5 p-0 img-container"
      @click="showPreviewModal = true"
    >
      <div class="btn-zoom">
        <b-icon-zoom-in class="h4"></b-icon-zoom-in>
      </div>
      <b-img
        fluid-grow
        class="checkered-background"
        :src="photoDetails.url"
        style="margin: 0 auto"
      />
    </b-container>
    <b-container fluid class="p-0">
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
    <b-modal
      v-model="showPreviewModal"
      content-class="border-0 rounded-0"
      body-class="p-0"
      centered
      hide-footer
      hide-header
      size="lg"
    >
      <b-img
        fluid-grow
        class="checkered-background"
        :src="photoDetails.url"
        style="margin: 0 auto"
      />
    </b-modal>
  </b-container>
</template>
<script>
import UTDButton from "@/components/UTDButton";

export default {
  name: "Preview",
  components: { UTDButton },
  props: {
    photoDetails: Object,
  },
  data() {
    const { fileName, url } = this.photoDetails;
    return {
      fileName,
      url,
      caption: "",
      description: "",
      showPreviewModal: false,
    };
  },
  methods: {
    onClose() {
      this.$emit("close");
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
    cursor: pointer;

    & .img-container:hover {
      .btn-zoom {
        opacity: 0.6;
      }
    }
    .btn-zoom {
      position: absolute;
      bottom: 5px;
      right: 5px;
      opacity: 0;
      background-color: rgba(0, 0, 0);
      border-radius: 10px;
      padding: 5px;
      height: 35px;
      width: 35px;
      color: white;
      transition: opacity 0.1s ease-in-out;

      svg {
        margin: 0;
      }
    }

    .img-preview-modal {
      .modal-body {
        padding: 0px !important;
      }
    }
  }

  &__back-button {
    border: none;
  }
}
.checkered-background {
  background: repeating-conic-gradient(#cacaca 0% 25%, transparent 0% 50%) 50% /
    20px 20px;
}
</style>
