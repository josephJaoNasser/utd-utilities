<template>
  <div class="block-utilities__nav border-right">
    <div class="d-flex flex-column h-100 overflow-auto">
      <div v-for="category in categories">
        <UTDButton
          type="light"
          class="mb-2 w-100"
          @click="onCategoryChange(category)"
        >
          {{ category }}
        </UTDButton>
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
    categories: Array,
  },
  emits: ["category-change"],
  methods: {
    onCategoryChange(category) {
      this.$emit("category-change", category);
    },
  },
};
</script>

<style lang="scss" scoped>
.block-utilities {
  &__nav {
    font-weight: 600;
    padding: 15px 10px;
    background-color: #f1f4f7;
    z-index: 1000;

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
