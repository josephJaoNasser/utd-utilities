<template></template>
<script>
import UTDService from "@/services/UTDService";

export default {
  name: "PhotoPicker",
  props: {
    token: String,
    query: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    async getPhotos(token) {
      const UTD = new UTDService(token);
      const photos = await UTD.getPhotos();
    },
  },
  async mounted() {

  }
};
</script>
