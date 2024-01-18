<template>
  <b-container class="p-3 rounded" style="background-color: rgb(0, 0, 0, 0.05)">
    <div @click="onClose">X</div>
    <div class="test-img-container">
      {{ photoDetails }}
    </div>
    <div>forms</div>
  </b-container>
</template>
<script>
export default {
  name: "Preview",
  props: {
    photoDetails: Object,
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
  },
};
</script>
