<template>
  <div class="block-utilities__nav border-right">
    <div ref="backDiv" class="d-flex mb-2 border-bottom pb-2">
      <UTDButton
        type="light"
        class="w-100 mr-2"
        :disabled="reactiveHistory.length < 2"
        @click="onBack"
      >
        <b-icon-chevron-left> </b-icon-chevron-left>
        Back
      </UTDButton>

      <UTDButton @click="toggleSearch" type="light">
        <b-icon-search></b-icon-search>
      </UTDButton>
    </div>
    <div class="d-flex flex-column overflow-auto" :style="navHeightOffset">
      <b-spinner
        v-if="!categories.length"
        variant="primary"
        class="align-self-center mt-3"
        small
      ></b-spinner>
      <div
        v-for="category in categories"
        :class="[
          'block-utilities__nav-item p-2',
          activeCategory === category ? 'active' : '',
        ]"
        @click="onCategoryChange(category)"
      >
        {{ category }}
      </div>
    </div>
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton";

export default {
  name: "BlocksNav",
  components: { UTDButton },
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    activeCategory: String,
  },
  emits: ["category-change"],
  data() {
    return {
      isMounted: false,
    };
  },
  methods: {
    onCategoryChange(category) {
      this.onAddHistory(category);
      this.$emit("category-change", category);
    },
  },
  computed: {
    navHeightOffset() {
      if (!this.isMounted) {
        return "";
      }

      const backDivRef = this.$refs.backDiv;
      const offsetHeightCSS = `height: calc(100% - ${backDivRef.clientHeight}px)`;

      return offsetHeightCSS;
    },
    reactiveHistory() {
      return this.history();
    },
  },
  mounted() {
    this.isMounted = true;
  },
  inject: ["history", "onBack", "onAddHistory", "toggleSearch"],
};
</script>

<style lang="scss" scoped>
.block-utilities {
  &__nav {
    font-weight: 600;
    padding: 15px 10px;
    background-color: #f1f4f7;
    z-index: 1000;

    &-item {
      cursor: pointer;
      border-radius: 8px;

      &:hover {
        background-color: #dcebf3;
      }

      &.active {
        color: var(--primary);
        background-color: #dcebf3;
      }
    }

    &-dropdown {
      list-style: none;
      top: 0;
      right: -110px;
      background: white;
      padding: 0;
      border-radius: 5px;
      width: max-content;
      -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);
      -moz-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);

      button {
        background-color: white;
        border: none;

        &:hover {
          background-color: #efefef;
        }
      }

      &:before {
        content: " ";
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        position: absolute;
        border-right: 10px solid white;
        left: -9.5px;
        top: 9px;
      }
    }

    button {
      display: flex;
      align-items: center;
      gap: 5px;
      text-align: left;
      box-shadow: none;

      &.nav-item {
        background: none;
        border: none;

        &:hover {
          background-color: #dfefff;
        }

        &:focus {
          box-shadow: none;
        }
      }
    }

    .nav-menu-item-text {
      width: 0%;
      height: 0%;
      overflow: hidden;
      display: none;
      transition: all 0.5s;
      margin-left: 12px;

      &.expanded {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
