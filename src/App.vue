<template>
  <div id="app">
    <PhotoUtilities />
  </div>
</template>

<script>
import UTDButton from "./components/UTDButton";
import PhotoUtilities from "./components/PhotoUtilities";

export default {
  name: "App",
  components: { UTDButton, PhotoUtilities },
  methods: {
    test() {
      alert("yo");
    },
  },
};
</script>
./components/PhotoUtilities
