<template>
  <div class="utd-utilities__photo-list-item position-relative">
    <!-- <div class="actions">
      <UTDButton
        size="sm"
        type="dark"
        pill
        class="action-btn"
        @click="$emit('edit-click')"
      >
        <b-icon icon="pencil" font-scale="1"></b-icon>
      </UTDButton>
    </div> -->
    <b-img-lazy
      :class="[
        'cursor-pointer rounded border',
        active && 'img-active border-5 border-primary',
      ]"
      fluid-grow
      blankColor="#bbb"
      :src="thumbnailUrl"
      style="aspect-ratio: 1; object-fit: cover"
    />
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton";
export default {
  name: "PhotoListItem",
  components: {
    UTDButton,
  },
  emits: ["click", "edit-click"],
  props: {
    thumbnailUrl: String,
    active: Boolean,
  },
  data() {
    return {
      isHovered: false,
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
    top: 10px;
    right: 10px;
    position: absolute;

    .action-btn {
      margin-left: 8px;
    }
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
