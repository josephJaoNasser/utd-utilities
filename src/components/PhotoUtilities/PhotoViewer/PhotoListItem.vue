<template>
  <div class="utd-utilities__photo-list-item position-relative">
    <div class="actions">
      <UTDButton
        size="sm"
        type="dark"
        class="action-btn"
        @click="isPreview = true"
      >
        <b-icon icon="zoom-in" font-scale="1"></b-icon>
      </UTDButton>

      <UTDButton size="sm" class="action-btn" @click="$emit('quick-select')">
        <b-icon icon="plus" font-scale="1"></b-icon>
      </UTDButton>
    </div>
    <b-img-lazy
      :class="[
        'cursor-pointer rounded border h-100',
        active && 'img-active border-5 border-primary',
      ]"
      fluid-grow
      blankColor="#bbb"
      :src="
        photoDetails.thumbnail?.length
          ? photoDetails.thumbnail
          : photoDetails.url
      "
      style="object-fit: cover"
    />
    <ImageModal v-model="isPreview" :url="photoDetails?.url" />
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton";
import ImageModal from "../components/ImageModal.vue";

export default {
  name: "PhotoListItem",
  components: {
    UTDButton,
    ImageModal,
  },
  emits: ["click", "edit-click"],
  props: {
    photoDetails: Object,
    active: Boolean,
  },
  data() {
    return {
      isHovered: false,
      isPreview: false,
    };
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.utd-utilities__photo-list-item {
  .actions {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    width: 100%;
    padding: 10px;
    bottom: 0;
    position: absolute;
    display: flex;
    background-color: rgba($color: #fff, $alpha: 0.5);
    justify-content: flex-end;
    gap: 5px;
  }

  &:hover {
    .actions {
      opacity: 0.8;
    }
  }
}

.cursor-pointer {
  cursor: pointer;
}

.border {
  &-dashed {
    border-style: dashed;
  }
  &-1 {
    border-width: 1px !important;
  }

  &-2 {
    border-width: 2px !important;
  }

  &-3 {
    border-width: 3px !important;
  }

  &-4 {
    border-width: 4px !important;
  }

  &-5 {
    border-width: 5px !important;
  }
}

.img-active {
  border-style: solid;
}
</style>
