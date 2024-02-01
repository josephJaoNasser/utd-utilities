<template>
  <div ref="textAreaParent" class="utd-utilities__textarea border rounded">
    <b-form-textarea
      v-bind="$attrs"
      class="border-0 shadow-none"
      no-resize
      @input="$emit('input', $event)"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
    ></b-form-textarea>
  </div>
</template>

<script>
export default {
  name: "UTDTextArea",
  props: {
    placeholder: String,
    value: String,
  },
  methods: {
    handleFocus() {
      this.$refs.textAreaParent.classList.add("focused");
    },

    handleBlur() {
      this.$refs.textAreaParent.classList.remove("focused");
    },
  },
};
</script>

<style lang="scss" scoped>
.utd-utilities {
  &__textarea {
    background-color: white;

    &.focused {
      outline: 1px solid #2a99d6;
      border-color: #2a99d6 !important;
    }
  }
}
</style>
