<template>
  <b-modal
    v-model="showPreviewModal"
    content-class="border-0 rounded-0 bg-transparent"
    body-class="p-0"
    centered
    hide-footer
    hide-header
    size="lg"
  >
    <b-img-lazy
      blankColor="#bbb"
      fluid-grow
      class="bg-transparent"
      :src="url"
      style="margin: 0 auto"
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
