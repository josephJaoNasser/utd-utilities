<template>
  <b-container fluid class="px-0 d-flex h-100">
    <BlocksNav
      class="position-sticky"
      style="top: 0px"
      :categories="categories"
      @category-change="(e) => (currentCategory = e)"
    />
    <b-container fluid class="px-0">
      <BlocksViewer
        :current-category="currentCategory"
        :blocks="blocks[currentCategory]"
        @block-selected="handleBlockSelect"
      />
    </b-container>
  </b-container>
</template>

<script>
import BlockService from "@/services/BlocksService";
import BlocksViewer from "./components/BlocksViewer";
import UTDButton from "../UTDButton/UTDButton.vue";
import BlocksNav from "./components/BlocksNav.vue";

export default {
  name: "BlockUtilities",
  props: {
    utdCredentials: Object,
  },
  components: {
    UTDButton,
    BlocksNav,
    BlocksViewer,
  },
  emits: ["block-selected"],
  data() {
    return {
      blocks: {},
      categories: [],
      currentCategory: "",
    };
  },
  methods: {
    async handleBlockSelect(block) {
      this.$emit("block-selected", block);
    },
  },
  async mounted() {
    const BlockServ = new BlockService(this.utdCredentials.token);

    try {
      const { blocks, categories } = await BlockServ.getBlocks();
      this.blocks = blocks;
      this.categories = categories;
      this.currentCategory = categories[0];
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped></style>
