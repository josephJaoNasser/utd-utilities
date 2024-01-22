<template>
  <b-modal v-model="modalShow" title="Create Album">
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
  </b-modal>
</template>

<script>
export default {
  name: "CreateAlbum",
  props: {
    show: Boolean,
  },
  emits: ["close"],
  data() {
    return {
      albumTitle: "",
      albumDescription: "",
      albumLabel: "",
    };
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
