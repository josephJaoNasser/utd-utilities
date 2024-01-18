<template>
  <div id="app">
    <Pickers />
  </div>
</template>

<script>
import UTDButton from "./components/UTDButton";
import Pickers from "./components/Pickers";

export default {
  name: "App",
  components: { UTDButton, Pickers },
  methods: {
    test() {
      alert("yo");
    },
  },
};
</script>
