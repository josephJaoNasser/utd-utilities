<template>
  <div>
    <b-container fluid class="sticky-top pt-4" style="background-color: white">
      <h2 class="font-weight-bold">Create AI Art</h2>
      <p>Create AI Art with our free AI image generator.</p>
      <b-row :class="[formattedImages.length ? 'mb-4' : '']">
        <b-col cols="12" lg="7" class="mb-2">
          <UTDInput
            v-model="prompt"
            placeholder="What do you want to create?"
          />
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
    </b-container>
    <b-row>
      <b-col v-if="isGenerating">Generating image/s...</b-col>
      <PhotoViewer
        v-else-if="images.length"
        source="ai"
        :default-photos="formattedImages"
        @photo-selected="onSelect"
      />
    </b-row>
  </div>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";
import UTDService from "@/services/UTDService";
import PhotoListItem from "../PhotoViewer/PhotoListItem.vue";
import PhotoViewer from "../PhotoViewer";
import PhotoSources from "@/constants/PhotoSources";

export default {
  name: "AIArtCreator",
  props: {
    token: String,
    defaultImages: {
      type: Array,
      default: () => [],
    },
  },
  components: { UTDInput, UTDButton, PhotoListItem, PhotoViewer },
  emits: ["image-created", "photo-selected"],
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

    onSelect(e) {
      this.$emit("photo-selected", e);
    },
  },
  computed: {
    formattedImages() {
      return this.images.map((imgObj, index) => ({
        ...imgObj,
        thumbnail: imgObj.url,
        id: index,
      }));
    },
  },
};
</script>
