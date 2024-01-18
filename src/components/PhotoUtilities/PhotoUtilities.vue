<template>
  <b-card style="max-width: 960px; margin: 0 auto">
    <b-container>
      <b-row>
        <b-col cols="3">
          <div>
            <UTDButton variant="primay">Upload Photo</UTDButton>
            <UTDButton variant="primay">Create Album</UTDButton>
          </div>

          <div></div>
          hello world

          <!-- <b-card-img
                src="https://picsum.photos/400/400/?image=20"
                alt="Image"
                class="rounded-0"
              ></b-card-img> -->
        </b-col>
        <b-col cols="9">
          The quick broun fox
          <!-- <b-card-body title="Horizontal Card">
                <b-card-text>
                  This is a wider card with supporting text as a natural lead-in to
                  additional content. This content is a little bit longer.
                </b-card-text>
              </b-card-body> -->
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import PhotoPicker from "../PhotoPicker/PhotoPicker.vue";
import AlbumPicker from "../AlbumPicker/AlbumPicker.vue";
import AIArtCreator from "../AIArtCreator/AIArtCreator.vue";
import UTDButton from "../UTDButton";

export default {
  name: "PhotoUtilities",
  components: {
    PhotoPicker,
    AlbumPicker,
    AIArtCreator,
    UTDButton,
  },
  data() {
    return {
      currentPicker: null,
    };
  },
};
</script>
