<template>
  <b-modal v-model="modalShow" title="Upload Photos" centered size="xl"  hide-footer>
    Upload photos
  </b-modal>
</template>

<script>
export default {
  name: "Uploader",
  props: {
    show: Boolean,
  },
  emits: ["close"],
  computed: {
    modalShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("close");
      },
    },
  },
};
</script>
