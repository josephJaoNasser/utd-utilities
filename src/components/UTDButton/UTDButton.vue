<template>
  <b-button :variant="variant">
    <slot></slot>
  </b-button>
</template>

<script>
import ButtonVariants from "@/constants/ButtonVariants";

export default {
  name: "UTDButton",
  props: {
    isLoading: Boolean,
    variant: {
      type: String,
      default: ButtonVariants.primary,
    },
  },
};
</script>

<style></style>
