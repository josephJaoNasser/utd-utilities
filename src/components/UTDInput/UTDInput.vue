<template>
  <div ref="inputParent" class="utd-utilities__input border rounded">
    <div v-if="icon?.length" class="px-2 border-right">
      <b-icon :icon="icon"></b-icon>
    </div>
    <b-input
      class="border-0 shadow-none"
      v-bind="$attrs"
      @input="$emit('input', $event)"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
    ></b-input>
  </div>
</template>

<script>
export default {
  name: "UTDInput",
  props: {
    icon: String,
    placeholder: String,
    value: String,
  },
  methods: {
    handleFocus() {
      this.$refs.inputParent.classList.add("focused");
    },

    handleBlur() {
      this.$refs.inputParent.classList.remove("focused");
    },
  },
};
</script>

<style scoped lang="scss">
.utd-utilities {
  &__input {
    display: flex;
    align-items: center;
    background-color: white;

    &.focused {
      outline: 1px solid #2a99d6;
      border-color: #2a99d6 !important;
    }
  }
}
</style>
