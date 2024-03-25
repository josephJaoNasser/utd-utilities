<template>
  <ul style="list-style: none">
    <li>
      <UTDButton
        block
        type="light"
        class="text-primary px-3 py-2 text-left d-flex align-items-center"
        @click="navEvents.toggleUploader"
      >
        <b-icon-image class="mr-2"></b-icon-image>
        Photo
      </UTDButton>
    </li>
    <li>
      <UTDButton
        block
        type="light"
        class="text-primary px-3 py-2 text-left d-flex align-items-center"
        @click="navEvents.toggleCreateAlbum"
      >
        <b-icon-images class="mr-2"></b-icon-images>
        Album
      </UTDButton>
    </li>
    <li>
      <UTDButton
        block
        type="light"
        class="text-primary px-3 py-2 text-left d-flex align-items-center"
        @click="navEvents.toggleUrlSelect"
      >
        <b-icon-link-45deg class="mr-2"></b-icon-link-45deg>
        Insert from <br />
        URL
      </UTDButton>
    </li>
  </ul>
</template>

<script>
import UTDButton from "@/components/UTDButton";
export default {
  name: "UploadMenu",
  components: {
    UTDButton,
  },
  inject: ["navEvents"],
};
</script>
