<template>
  <b-modal
    v-model="modalShow"
    hide-footer
    hide-header
    centered
    size="lg"
    content-class="p-3"
  >
    <h3 class="mb-4 font-weight-bold">Create album</h3>
    <div class="position-absolute" style="right: -30px; top: -30px">
      <b-button variant="danger" @click="modalShow = false">
        <b-icon-x></b-icon-x>
      </b-button>
    </div>
    <b-form>
      <b-form-group label="Album Title" label-for="albumTitle">
        <b-form-input
          id="albumTitle"
          v-model="albumTitle"
          type="text"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Description" label-for="albumTitle">
        <b-form-textarea
          no-resize
          rows="4"
          type="text"
          name="albumDescription"
          v-model="albumDescription"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group label="Label" label-for="albumTitle">
        <b-form-input
          id="albumLabel"
          v-model="albumLabel"
          type="text"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
    <UTDButton @click="handleUpload">Create Album</UTDButton>
  </b-modal>
</template>

<script>
import UTDButton from "../UTDButton";
export default {
  name: "CreateAlbum",
  props: {
    show: Boolean,
  },
  components: {
    UTDButton,
  },
  emits: ["close", "album-create"],
  data() {
    return {
      albumTitle: "",
      albumDescription: "",
      albumLabel: "",
    };
  },
  methods: {
    handleUpload() {},
  },
  computed: {
    modalShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("close");
      },
    },
  },
};
</script>
