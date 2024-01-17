<template>
  <div id="app">
    <UTDButton @click="test" variant="primary"> Hello world! </UTDButton>
  </div>
</template>

<script>
import UTDButton from "./components/UTDButton";

export default {
  name: "App",
  components: { UTDButton },
  methods: {
    test() {
      alert("Hello world!");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
