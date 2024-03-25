<template>
  <b-modal
    v-model="modalShow"
    hide-footer
    hide-header
    centered
    size="lg"
    content-class="p-2 p-md-3"
  >
    <h3 class="mb-4 font-weight-bold">Insert via URL</h3>
    <div class="position-absolute" style="right: -30px; top: -30px">
      <b-button variant="danger" @click="modalShow = false">
        <b-icon-x></b-icon-x>
      </b-button>
    </div>
    <div class="mb-3">
      <p>Insert image by pasting the image URL of the image</p>
      <UTDInput icon="link" v-model="url" />
    </div>
    <UTDButton @click="handleLink">
      <b-icon-plus class="mr-2"></b-icon-plus>
      Insert
    </UTDButton>
  </b-modal>
</template>

<script>
import UTDInput from "@/components/UTDInput";
import UTDButton from "@/components/UTDButton/UTDButton.vue";

export default {
  name: "UrlSelect",
  props: {
    show: Boolean,
  },
  components: {
    UTDInput,
    UTDButton,
  },
  data() {
    return {
      url: "",
    };
  },
  emits: ["close", "image-linked"],
  computed: {
    modalShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.image = null;
        this.handleClose();
      },
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },

    handleLink() {
      this.$emit("image-linked", { url: this.url });
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped></style>
