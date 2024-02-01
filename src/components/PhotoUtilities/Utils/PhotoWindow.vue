<template>
  <b-container
    :class="['position-relative mb-5 img-container', borders ? 'border' : '']"
    @click="showPreviewModal = true"
  >
    <div class="btn-zoom">
      <b-icon-zoom-in class="h4"></b-icon-zoom-in>
    </div>
    <b-img-lazy
      blankColor="#bbb"
      fluid-grow
      class="checkered-background"
      :src="url"
      :style="styleObj"
    />
    <ImageModal v-model="showPreviewModal" :url="url" />
  </b-container>
</template>

<script>
import ImageModal from "./ImageModal.vue";

export default {
  name: "PhotoWindow",
  components: { ImageModal },
  props: {
    url: String,
    maxHeight: String,
    borders: {
      type: Boolean,
      default: false,
    },
    roundedImage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPreviewModal: false,
    };
  },
  computed: {
    styleObj() {
      const styles = {
        objectFit: "contain",
        margin: "0 auto",
      };

      if (this.maxHeight) {
        styles.maxHeight = this.maxHeight + "px";
      }

      if (this.roundedImage) {
        styles.borderRadius = "15px";
        styles.overflow = "hidden";
      }

      return styles;
    },
  },
};
</script>

<style lang="scss" scoped>
.img-container {
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  overflow: hidden;

  &:hover {
    .btn-zoom {
      opacity: 0.6;
    }
  }
}

.img-preview-modal {
  .modal-body {
    padding: 0px !important;
  }
}

.btn-zoom {
  position: absolute;
  bottom: 10px;
  right: 10px;
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
</style>
