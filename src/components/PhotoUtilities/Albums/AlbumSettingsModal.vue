<template>
  <b-modal
    v-model="modalShow"
    hide-footer
    hide-header
    centered
    size="lg"
    content-class="p-3"
  >
    <h3 class="mb-4 font-weight-bold">Album Settings</h3>
    <div class="position-absolute" style="right: -30px; top: -30px">
      <b-button variant="danger" @click="modalShow = false">
        <b-icon-x></b-icon-x>
      </b-button>
    </div>
    <b-form>
      <b-form-group label="Album Title" label-for="albumName">
        <b-form-input
          id="albumName"
          v-model="albumName"
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
    <UTDButton @click="handleUpdateAlbum" :loading="isUpdatingAlbum">
      <b-icon-pencil class="mr-2"></b-icon-pencil>
      Update Album
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
    token: String,
    accountId: Number,
    albumDetails: Object,
    organizationId: Number,
  },
  components: {
    UTDButton,
  },
  emits: ["close", "album-updated"],
  data() {
    return {
      albumName: this.albumDetails.albumName,
      albumDescription: this.albumDetails.albumDescription,
      albumLabel: "",
      isUpdatingAlbum: false,
    };
  },
  methods: {
    async handleUpdateAlbum() {
      this.isUpdatingAlbum = true;
      try {
        const UTD = new PhotoService();
        const res = await UTD.editAlbum(this.albumDetails.id.toString(), {
          albumName: this.albumName,
          albumDescription: this.albumDescription,
        });

        if (res.success) {
          this.$emit("album-updated", {
            albumName: this.albumName,
            albumDescription: this.albumDescription,
            albumImage: this.albumDetails.albumImage,
          });

          this.$emit("close");
        }
      } catch (e) {
        console.log(e);
      }
      this.isUpdatingAlbum = false;
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
