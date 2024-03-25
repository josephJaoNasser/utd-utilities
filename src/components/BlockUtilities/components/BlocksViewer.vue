<template>
  <b-container fluid class="px-0 h-100 position-relative">
    <div class="utd-utilities__search shadow" v-if="showSearch">
      <Search
        class="w-full"
        :searchSource="SearchSource.blocks"
        :utd-credentials="utdCredentials"
        @search-start="handleSearchStart"
        @search-complete="handleSearchComplete"
        @search-end="handleSearchEnd"
        @close="toggleSearch"
      />
    </div>

    <b-container
      fluid
      class="d-flex justify-content-between align-items-center py-2 px-3 border-bottom"
    >
      <div>
        <small style="color: #888">Blocks</small>
        <h4 class="mb-0 font-weight-bold">{{ currentCategory }}</h4>
      </div>
      <UTDButton @click="toggleSearch" type="light">
        <b-icon-search></b-icon-search>
      </UTDButton>
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
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import Search from "@/components/GeneralUIComponents/Search.vue";
import SearchSource from "@/constants/SearchSource";

export default {
  name: "BlocksViewer",
  props: {
    utdCredentials: Object,
    currentCategory: String,
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
      showSearch: false,
    };
  },
  methods: {
    handleBlockSelect(block) {
      this.$emit("block-selected", block);
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
    },
    handleSearchStart() {},
    handleSearchEnd() {},
    handleSearchComplete() {},
  },
  computed: {
    SearchSource: () => SearchSource,
  },
};
</script>

<style lang="scss" scoped>
.block-grid-container {
  height: calc(100% - 70px);
  overflow-x: hidden;
  overflow-y: auto;
}

.utd-utilities {
  &__search {
    position: absolute;
    top: 0;
    z-index: 1040;
    padding: 10px;
    background-color: white;
    border: 1px solid #ccc;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
