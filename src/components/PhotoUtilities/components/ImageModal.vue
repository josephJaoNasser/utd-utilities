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
    <b-img-lazy
      blankColor="#bbb"
      :src="url"
      style="margin: 0 auto; max-height: 90vh; max-width: 100%"
    />
  </b-modal>
</template>

<script>
export default {
  name: "ImageModal",
  props: {
    url: String,
    show: Boolean,
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

<style lang="scss" scoped></style>
