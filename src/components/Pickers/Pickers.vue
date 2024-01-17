<template></template>
<script>
import PhotoPicker from "../PhotoPicker/PhotoPicker.vue";
import AlbumPicker from "../AlbumPicker/AlbumPicker.vue";
import AIArtCreator from "../AIArtCreator/AIArtCreator.vue";

export default {
  name: "Pickers",
  components: {
    PhotoPicker,
    AlbumPicker,
    AIArtCreator,
  },
  data() {
    return {
      currentPicker: null,
    };
  },
};
</script>
