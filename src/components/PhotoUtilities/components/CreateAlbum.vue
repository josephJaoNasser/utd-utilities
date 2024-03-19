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

      <!-- <b-form-group label="Label" label-for="albumTitle">
        <b-form-input
          id="albumLabel"
          v-model="albumLabel"
          type="text"
          required
        ></b-form-input>
      </b-form-group> -->
    </b-form>
    <UTDButton @click="handleCreateAlbum" :loading="isCreatingAlbum">
      <b-icon-plus-square-fill class="mr-2"></b-icon-plus-square-fill>
      Create Album
    </UTDButton>
  </b-modal>
</template>

<script>
import PhotoService from "@/services/PhotoService";
import UTDButton from "@/components/UTDButton";
export default {
  name: "CreateAlbum",
  props: {
    show: Boolean,
    utdCredentials: Object,
  },
  components: {
    UTDButton,
  },
  emits: ["close", "album-created"],
  data() {
    return {
      albumTitle: "",
      albumDescription: "",
      albumLabel: "",
      isCreatingAlbum: false,
    };
  },
  methods: {
    async handleCreateAlbum() {
      this.isCreatingAlbum = true;
      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const res = await UTD.createAlbum({
          albumName: this.albumTitle,
          albumDescription: this.albumDescription,
          accountId: this.utdCredentials.organizationId,
        });

        this.$emit("album-created", res.payload);
        this.$emit("close");
      } catch (e) {
        console.log(e);
      }
      this.isCreatingAlbum = false;
    },
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
