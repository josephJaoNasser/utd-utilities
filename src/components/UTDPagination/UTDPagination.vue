<template>
  <b-pagination
    class="utd-utilities__pagination"
    v-model="currentPage"
    :total-rows="totalItems"
    :per-page="perPage"
    :align="'center'"
  ></b-pagination>
</template>

<script>
export default {
  name: "UTDPagination",
  props: {
    page: Number,
    perPage: Number,
    totalItems: Number,
  },
  emits: ["page-change"],
  model: {
    prop: "page",
    event: "page-change",
  },
  methods: {
    handleChange(e) {
      e.preventDefault();
      console.log(e);
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("page-change", val);
      },
    },
  },
};
</script>

<style lang="scss">
.utd-utilities__pagination {
  margin-bottom: 0;
  .page-item {
    .page-link {
      border-radius: 3px;
      border: none;
    }
  }
}
</style>
