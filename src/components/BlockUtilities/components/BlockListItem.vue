<template>
  <div class="utd-utilities__block-list-item border rounded p-0">
    <div class="border-bottom position-relative">
      <div class="actions">
        <UTDButton
          size="sm"
          type="dark"
          class="action-btn"
          @click="showPreviewModal = true"
        >
          <b-icon icon="zoom-in" font-scale="1"></b-icon>
        </UTDButton>

        <UTDButton
          size="sm"
          class="action-btn"
          @click="$emit('quick-select', block)"
        >
          <b-icon icon="plus" font-scale="1"></b-icon>
        </UTDButton>
      </div>
      <b-img
        lazy
        :src="block.screenshot"
        class="w-100"
        style="height: 150px; object-fit: contain"
      />
    </div>
    <p class="p-2">{{ block.name }}</p>
    <ImageModal v-model="showPreviewModal" :url="block.screenshot" />
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import ImageModal from "@/components/GeneralUIComponents/ImageModal.vue";

export default {
  name: "BlockListItem",
  props: {
    block: Object,
  },
  components: {
    UTDButton,
    ImageModal,
  },
  emits: ["quick-select"],
  data() {
    return {
      showPreviewModal: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.utd-utilities__block-list-item {
  .actions {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    width: 100%;
    padding: 10px;
    top: 0;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
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
