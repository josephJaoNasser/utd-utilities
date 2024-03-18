<template>
  <b-modal
    v-model="showPreviewModal"
    content-class="border-0 rounded-0 bg-transparent w-fit-content mx-auto"
    body-class="p-0 text-center w-fit-content mx-auto"
    dialog-class="w-fit-content mx-auto"
    centered
    hide-footer
    hide-header
    size="xl"
  >
    <UTDButton
      class="utd-utilities__image-modal__close-btn"
      type="dark"
      @click="showPreviewModal = false"
    >
      <b-icon-x></b-icon-x>
    </UTDButton>
    <b-img-lazy
      blankColor="#bbb"
      :src="url"
      style="margin: 0 auto; max-height: 90vh; max-width: 100%"
    />
  </b-modal>
</template>

<script>
import UTDButton from "@/components/UTDButton/UTDButton.vue";

export default {
  name: "ImageModal",
  props: {
    url: String,
    show: Boolean,
  },
  components: {
    UTDButton,
  },
  model: {
    prop: "show",
    event: "toggle",
  },
  // data() {
  //   return {
  //     showPreviewModal: false,
  //   }
  // },
  computed: {
    showPreviewModal: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.utd-utilities {
  &__image-modal {
    &__close-btn {
      padding: 4px 5px;
      border-radius: 999px;
      opacity: 0.6;
      right: -15px;
      top: -15px;
      position: absolute;
    }
  }
}
</style>
