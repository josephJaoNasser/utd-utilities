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
          @click="handleBlockSelect(block)"
        >
          <div class="border rounded p-0">
            <div class="border-bottom">
              <b-img
                lazy
                :src="block.screenshot"
                class="w-100"
                style="height: 150px; object-fit: contain"
              />
            </div>
            <p class="p-2">{{ block.name }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
export default {
  name: "BlocksViewer",
  props: {
    currentCategory: String,
    blocks: {
      type: Array,
      defailt: () => [],
    },
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
