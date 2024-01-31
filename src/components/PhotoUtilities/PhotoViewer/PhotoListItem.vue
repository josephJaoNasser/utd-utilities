<template>
  <b-img-lazy
    :class="['cursor-pointer', active && 'img-active border-5 border-primary']"
    fluid-grow
    blankColor="#bbb"
    :src="thumbnailUrl"
  />
</template>

<script>
export default {
  name: "PhotoListItem",
  emits: ["click"],
  props: {
    thumbnailUrl: String,
    active: Boolean,
  },
  data() {
    return {
      isHovered: false,
    };
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}

.border {
  &-dashed {
    border-style: dashed;
  }
  &-1 {
    border-width: 1px !important;
  }

  &-2 {
    border-width: 2px !important;
  }

  &-3 {
    border-width: 3px !important;
  }

  &-4 {
    border-width: 4px !important;
  }

  &-5 {
    border-width: 5px !important;
  }
}

.img-active {
  border-style: solid;
}
</style>
