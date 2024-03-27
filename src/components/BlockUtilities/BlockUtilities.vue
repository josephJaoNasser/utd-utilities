<template>
  <b-container fluid class="px-0 d-flex h-100">
    <BlocksNav
      class="position-sticky"
      style="top: 0px"
      :categories="categories"
      :active-category="currentCategory"
    />
    <b-container fluid class="px-0 position-relative">
      <div class="utd-utilities__search shadow" v-if="showSearch">
        <Search
          class="w-full"
          :searchSource="SearchSource.blocks"
          :utd-credentials="utdCredentials"
          @search-start="handleSearchStart"
          @search-complete="handleSearchComplete"
          @search-end="handleSearchEnd"
          @close="showSearch = false"
        />
      </div>

      <BlocksViewer
        :utd-credentials="utdCredentials"
        :current-category="currentCategory"
        :blocks="useSearch ? searchResults : blocks[currentCategory]"
        :searchParams="{
          useSearch,
          isSearching,
          searchString,
        }"
        @block-selected="handleBlockSelect"
      />
    </b-container>
  </b-container>
</template>

<script>
import BlocksViewer from "./components/BlocksViewer";
import UTDButton from "../UTDButton/UTDButton.vue";
import BlocksNav from "./components/BlocksNav.vue";
import BlockService from "@/services/BlocksService";
import SearchSource from "@/constants/SearchSource";
import Search from "../GeneralUIComponents/Search.vue";

export default {
  name: "BlockUtilities",
  props: {
    utdCredentials: Object,
  },
  components: {
    UTDButton,
    BlocksNav,
    BlocksViewer,
    Search,
  },
  emits: ["block-selected"],
  data() {
    return {
      blocks: {},
      searchResults: [],
      categories: [],
      history: [],
      useSearch: false,
      showSearch: false,
      isSearching: false,
      currentCategory: "",
      searchString: "",
    };
  },
  methods: {
    async handleBlockSelect(block) {
      this.$emit("block-selected", block);
    },
    handleBack() {
      if (this.history.length < 2) return;

      let lastHistoryIndex = this.history.length - 1;

      if (this.history[lastHistoryIndex] === "Search") {
        this.useSearch = false;
        this.searchResults = [];
      }

      this.history.splice(lastHistoryIndex, 1);
      this.currentCategory = this.history[this.history.length - 1];
    },
    handleAddHistory(category) {
      this.history.push(category);
      this.currentCategory = category;
    },
    handleSearchToggle() {
      this.showSearch = !this.showSearch;
    },
    handleSearchComplete({ result, searchString }) {
      this.useSearch = true;
      this.searchResults = result;
      this.searchString = searchString;
    },
    handleSearchStart() {
      this.isSearching = true;
      this.handleAddHistory("Search");
    },
    handleSearchEnd() {
      this.isSearching = false;
    },
    handleSearchClose() {
      this.useSearch = false;
      this.searchString = "";
    },
  },
  computed: {
    SearchSource: () => SearchSource,
  },
  async mounted() {
    const BlockServ = new BlockService(this.utdCredentials.token);

    try {
      const { blocks, categories } = await BlockServ.getBlocks();
      this.blocks = blocks;
      this.categories = categories;
      this.currentCategory = categories[0];
      this.history.push(this.currentCategory);
    } catch (e) {
      console.log(e);
    }
  },
  provide() {
    return {
      history: () => this.history,
      onBack: this.handleBack,
      onAddHistory: this.handleAddHistory,
      toggleSearch: this.handleSearchToggle,
    };
  },
};
</script>

<style lang="scss" scoped>
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
