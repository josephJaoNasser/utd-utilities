<template>
  <b-button
    variant="primary"
    v-bind="$attrs"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="handleClick"
    class="base-button"
    :variant="!outline ? type : `outline-${type}`"
    :size="size"
    :block="block"
    :class="[
      { 'rounded-circle': round },
      { 'btn-wd': wide },
      { 'btn-icon btn-fab': icon },
      { 'btn-link': link },
      { disabled: disabled },
    ]"
  >
    <slot v-if="!loading"></slot>
    <b-spinner v-else small></b-spinner>
  </b-button>
</template>

<script>
export default {
  name: "UTDButton",
  props: {
    round: Boolean,
    icon: Boolean,
    block: Boolean,
    loading: Boolean,
    wide: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: "primary",
      description: "Button type (primary|secondary|danger etc)",
    },
    nativeType: {
      type: String,
      default: "button",
      description: "Button native type (e.g button, input etc)",
    },
    size: {
      type: String,
      default: "",
      description: "Button size (sm|lg)",
    },
    outline: {
      type: Boolean,
      description: "Whether button is outlined (only border has color)",
    },
    link: {
      type: Boolean,
      description: "Whether button is a link (no borders or background)",
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    },
  },
};
</script>
