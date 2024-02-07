<template>
  <b-container fluid class="sticky-top p-0 pt-4" style="background-color: white">
    <h2 class="font-weight-bold">Create AI Art</h2>
    <p>Create AI Art with our free AI image generator.</p>

    <b-row>
      <b-col
        class="border-md-right border-md-bottom-0 px-1 mb-3"
        cols="12"
        md="5"
        lg="4"
        xl="3"
      >
        <b-container fluid>
          <UTDTextArea
            class="mb-3"
            v-model="prompt"
            :rows="4"
            placeholder="What do you want to create?"
          />
          <UTDButton
            :loading="isGeneratingFromPrompt"
            :disabled="isGeneratingFromPrompt || isGeneratingRandom"
            class="mr-2 mb-2"
            block
            @click="getAIArt(false)"
          >
            <b-icon-brush-fill class="mr-2"></b-icon-brush-fill>
            Create!
          </UTDButton>
          <UTDButton
            :loading="isGeneratingRandom"
            :disabled="isGeneratingFromPrompt || isGeneratingRandom"
            outline
            class="mr-2 mb-2"
            block
            @click="getAIArt(true)"
          >
            Create random image
          </UTDButton>
          <div v-if="images.length" class="border-top pt-3">
            <UTDButton
              type="success"
              block
              @click="onSelect({ url: images[0].url })"
            >
            <b-icon-check class="mr-1"></b-icon-check>
              Use image
            </UTDButton>
          </div>
        </b-container>
      </b-col>
      <b-col cols="12" md="7" lg="8" xl="9">
        <b-container
          fluid
          class="text-center mb-3 p-4"
          style="color: #888"
          v-if="!images.length"
        >
          <p>
            <b-icon-stars style="height: 100px; width: 100px"></b-icon-stars>
          </p>
          <p
            class="text-center"
            v-if="!isGeneratingFromPrompt && !isGeneratingRandom"
          >
            Tell us what you want to create!<br />
            Your image will appear here
          </p>
          <p
            v-else-if="isGeneratingFromPrompt || isGeneratingRandom"
            class="text-center"
          >
            Creating your image! Please wait a moment...
          </p>
        </b-container>
        <b-container
          fluid
          class="text-center mb-3 p-4"
          v-if="isGeneratingFromPrompt || isGeneratingRandom"
        >
          <b-spinner
            label="Loading..."
            variant="primary"
            type="grow"
          ></b-spinner>
        </b-container>
        <b-container fluid class="mb-3 p-0 p-md-4" v-else-if="images.length">
          <PhotoWindow :url="images[0].url" rounded-image />
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";
import UTDService from "@/services/UTDService";
import PhotoListItem from "../PhotoViewer/PhotoListItem.vue";
import PhotoWindow from "../Utils/PhotoWindow.vue";
import UTDTextArea from "@/components/UTDTextArea";

export default {
  name: "AIArtCreator",
  props: {
    token: String,
    defaultImages: {
      type: Array,
      default: () => [],
    },
  },
  components: { UTDInput, UTDButton, PhotoListItem, UTDTextArea, PhotoWindow },
  emits: ["image-created", "photo-selected"],
  data() {
    return {
      prompt: "",
      images: this.defaultImages,
      selectedPhoto: null,
      showPreviewModal: false,
      isGeneratingRandom: false,
      isGeneratingFromPrompt: false,
    };
  },
  methods: {
    async getAIArt(random) {
      let prompt = this.prompt;

      if (random) {
        this.isGeneratingRandom = true;
        prompt = "Create a random image";
      } else {
        this.isGeneratingFromPrompt = true;
      }

      try {
        this.images = [];
        const UTD = new UTDService(this.token);
        const { payload } = await UTD.generateAIImages(prompt, 11);

        this.images = payload.data;
        this.$emit("image-created", payload.data);
      } catch (e) {
        console.log(e);
      }

      this.isGeneratingRandom = false;
      this.isGeneratingFromPrompt = false;
    },

    onSelect(e) {
      this.$emit("photo-selected", e);
    },
  },
};
</script>

<style scoped lang="scss"></style>
