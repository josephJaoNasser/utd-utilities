<template>
  <div class="border rounded">
    <component v-if="icon?.length" :is="'b-icon-' + icon" />
    <b-input class="border-0"></b-input>
  </div>
</template>

<script>
export default {
  name: "UTDInput",
  props: {
    icon: String,
  },
  model: {},
  props: {},
  data() {
    return {};
  },
};
</script>
