<template>
  <b-container fluid class="px-0 h-100 position-relative">
    <b-container
      ref="blockViewerHeader"
      fluid
      class="d-flex justify-content-between align-items-center py-2 px-3 border-bottom"
    >
      <div>
        <small v-if="!searchParams.useSearch" style="color: #888">Blocks</small>
        <small v-else style="color: #888">Search</small>

        <h4 v-if="!searchParams.useSearch" class="mb-0 font-weight-bold">
          {{ currentCategory }}
        </h4>

        <h4 v-else class="mb-0 font-weight-bold">
          "{{ searchParams.searchString }}"
        </h4>
      </div>
    </b-container>
    <b-container
      fluid
      class="block-grid-container px-4 py-2"
      :style="offsetHeight"
    >
      <p
        v-if="searchParams.useSearch && !blocks.length"
        class="text-center my-3"
      >
        <i>No search results for "{{ searchParams.searchString }}"</i>
      </p>
      <b-row v-else cols="2" cols-sm="3" cols-md="4" cols-lg="5" cols-xl="6">
        <b-col
          v-for="block in blocks"
          class="p-2 cursor-pointer"
          :key="block.id"
        >
          <BlockListItem
            :block="block"
            :utd-credentials="utdCredentials"
            @quick-select="handleBlockSelect"
          />
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import BlockListItem from "./BlockListItem";
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import Search from "@/components/GeneralUIComponents/Search.vue";

export default {
  name: "BlocksViewer",
  props: {
    utdCredentials: Object,
    currentCategory: String,
    searchParams: {
      type: Object,
      default: () => ({
        useSearch: false,
        isSearching: false,
        searchString: "",
      }),
    },
    blocks: {
      type: Array,
      defailt: () => [],
    },
  },
  components: {
    BlockListItem,
    UTDButton,
    Search,
  },
  emits: ["block-selected"],
  data() {
    return {
      isMounted: false,
      showSearch: false,
    };
  },
  methods: {
    handleBlockSelect(block) {
      this.$emit("block-selected", block);
    },
  },
  computed: {
    offsetHeight() {
      if (!this.isMounted) return "";

      const offsetHeight = this.$refs.blockViewerHeader.clientHeight + 1;
      return `height: calc(100% - ${offsetHeight}px)`;
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss" scoped>
.block-grid-container {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
