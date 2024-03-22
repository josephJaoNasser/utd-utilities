<template>
  <b-container fluid class="px-0 h-100">
    <b-container fluid class="py-2 px-3 border-bottom">
      <small style="color: #888">Blocks</small>
      <h4 class="mb-0 font-weight-bold">{{ currentCategory }}</h4>
    </b-container>
    <b-container fluid class="block-grid-container px-4 py-2">
      <b-row cols="2" cols-sm="3" cols-md="4" cols-lg="5" cols-xl="6">
        <b-col
          v-for="block in blocks"
          class="p-2 cursor-pointer"
          :key="block.id"
        >
          <BlockListItem :block="block" @quick-select="handleBlockSelect" />
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import BlockListItem from "./BlockListItem";

export default {
  name: "BlocksViewer",
  props: {
    currentCategory: String,
    blocks: {
      type: Array,
      defailt: () => [],
    },
  },
  components: {
    BlockListItem,
  },
  emits: ["block-selected"],
  methods: {
    handleBlockSelect(block) {
      this.$emit("block-selected", block);
    },
  },
};
</script>

<style lang="scss" scoped>
.block-grid-container {
  height: calc(100% - 70px);
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
