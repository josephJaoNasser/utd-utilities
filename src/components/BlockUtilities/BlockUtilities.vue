<template>
  <b-container fluid class="px-0 d-flex h-100">
    <BlocksNav
      class="position-sticky"
      style="top: 0px"
      :categories="categoryStrings"
      @category-change="(e) => (currentCategory = e)"
    />
    <b-container fluid class="px-0">
      <BlocksViewer
        :utd-credentials="utdCredentials"
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
      const BlockServ = new BlockService(this.utdCredentials.token);
      try {
        const blockCodeData = await BlockServ.getBlockCode(block.id);
        this.$emit("block-selected", blockCodeData);
      } catch (e) {}
    },
  },
  computed: {
    categoryStrings() {
      return this.categories.map((catBlocks) => catBlocks.category);
    },
  },
  async mounted() {
    const BlockServ = new BlockService(this.utdCredentials.token);

    try {
      const { blocks, categoryBlocks } = await BlockServ.getBlocks();
      this.blocks = blocks;
      this.categories = categoryBlocks.map((blck) => blck);
      this.currentCategory = categoryBlocks[0].category;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped></style>
