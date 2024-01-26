<template>
  <div>
    <h2 class="font-weight-bold">Create AI Art</h2>
    <p>Create AI Art with our free AI image generator.</p>
    <b-row>
      <b-col cols="12" lg="7" class="mb-2">
        <UTDInput v-model="prompt" placeholder="What do you want to create?" />
      </b-col>
      <b-col cols="12" lg="5">
        <UTDButton class="mr-2 mb-2" @click="getAIArt(false)">
          Generate Images
        </UTDButton>
        <UTDButton class="mr-2 mb-2" @click="getAIArt(true)">
          Create random image
        </UTDButton>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="isGenerating">Generating image/s...</b-col>
      <b-row v-else cols="3" cols-md="2" cols-lg="3" no-gutters>
        <b-col
          v-for="(image, index) in images"
          class="p-1 p-md-2"
          @click="
            () => {
              selectedPhoto = image.url;
              showPreviewModal = true;
            }
          "
          :key="index"
        >
          <PhotoListItem :thumbnail-url="image.url" />
        </b-col>
      </b-row>
    </b-row>

    <b-modal
      v-model="showPreviewModal"
      content-class="border-0 rounded-0"
      body-class="p-0"
      centered
      hide-footer
      hide-header
      size="lg"
    >
      <b-img
        fluid-grow
        class="checkered-background"
        :src="selectedPhoto"
        style="margin: 0 auto"
      />
    </b-modal>
  </div>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";
import UTDService from "@/services/UTDService";
import PhotoListItem from "../PhotoViewer/PhotoListItem.vue";

export default {
  name: "AIArtCreator",
  props: {
    token: String,
    defaultImages: {
      type: Array,
      default: () => [],
    },
  },
  components: { UTDInput, UTDButton, PhotoListItem },
  emits: ["image-created"],
  data() {
    return {
      prompt: "",
      images: this.defaultImages,
      selectedPhoto: null,
      showPreviewModal: false,
      isGenerating: false,
    };
  },
  methods: {
    async getAIArt(random) {
      this.isGenerating = true;
      let prompt = this.prompt;

      if (random) {
        prompt = "Create a random image";
      }

      try {
        const UTD = new UTDService(this.token);
        const { payload } = await UTD.generateAIImages(prompt, 11);

        this.images = payload.data;
        this.$emit("image-created", payload.data);
      } catch (e) {
        console.log(e);
      }
      this.isGenerating = false;
    },
  },
};
</script>
