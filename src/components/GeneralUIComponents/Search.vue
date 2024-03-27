<template>
  <div class="d-flex">
    <b-container fluid>
      <UTDInput
        class="mr-2 w-100"
        v-model="searchString"
        :placeholder="placeholder"
      />
    </b-container>
    <div class="d-flex">
      <UTDButton @click="search" :loading="isSearching" class="mr-2">
        <b-icon-search></b-icon-search>
      </UTDButton>
      <UTDButton v-if="!hideCloseButton" type="light" @click="$emit('close')">
        <b-icon-x></b-icon-x>
      </UTDButton>
    </div>
  </div>
</template>

<script>
import UTDInput from "@/components/UTDInput";
import UTDButton from "@/components/UTDButton";
import SearchHelper from "@/helpers/SearchHelper";

export default {
  name: "Search",
  props: {
    searchSource: String,
    placeholder: {
      type: String,
      default: "Search...",
    },
    utdCredentials: Object,
    hideCloseButton: Boolean,
  },
  components: {
    UTDInput,
    UTDButton,
  },
  emits: [
    "search-complete",
    "search-start",
    "search-failed",
    "search-end",
    "close",
  ],
  data() {
    return {
      searchString: "",
      isSearching: false,
    };
  },
  methods: {
    async search() {
      this.isSearching = true;
      this.$emit("search-start");
      const Search = new SearchHelper({
        accountId: this.utdCredentials.userId,
        token: this.utdCredentials.token,
        searchString: this.searchString,
      });

      try {
        const { success, payload } = await Search[this.searchSource]();

        if (!success) {
          this.$emit("search-failed");
          return;
        }

        this.$emit("search-complete", {
          searchString: this.searchString,
          searchSource: this.searchSource,
          result: payload,
        });
      } catch (e) {
        this.$emit("search-failed");
        console.log(e);
      }
      this.$emit("search-end", this.searchString);
      this.isSearching = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
@/helpers/SearchHelper
