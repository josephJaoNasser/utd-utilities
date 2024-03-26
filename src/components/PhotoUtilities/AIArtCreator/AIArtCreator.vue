<template>
  <b-container
    fluid
    class="sticky-top p-0 pt-4 utd-utilities__ai-art"
    style="background-color: white"
  >
    <b-container fluid class="border-bottom px-3 mx-0">
      <h2 class="font-weight-bold">Create AI Art</h2>
      <p>Create AI Art with our free AI image generator.</p>
    </b-container>

    <b-container fluid class="px-3" style="height: calc(100% - 90px)">
      <b-row class="h-100">
        <b-col
          class="border-md-right border-md-bottom-0 px-1 pt-3 mb-3"
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

            <div class="">
              <div class="mb-4" v-for="param in aiArtParams">
                <div class="d-flex flex-wrap">
                  <div class="font-weight-bold mb-2">{{ param.name }}</div>
                </div>

                <v-select
                  :options="param.params"
                  :placeholder="`Select ${param.name}...`"
                  label="name"
                  :clearable="false"
                  @input="(e) => onStyleSelect(param.name, e.prompt)"
                >
                  <template slot="option" slot-scope="option">
                    <div
                      class="ai-art-param d-flex align-items-center position-relative"
                    >
                      <img :src="option.image" />
                      {{ option.name }}
                    </div>
                  </template>
                </v-select>
              </div>
            </div>

            <UTDButton
              :loading="isGeneratingFromPrompt"
              :disabled="isGeneratingFromPrompt || isGeneratingRandom"
              class="mr-2 mb-2"
              block
              @click="getAIArt(false)"
            >
              <b-icon-brush-fill
                v-if="!images.length"
                class="mr-2"
              ></b-icon-brush-fill>
              <b-icon-arrow-clockwise
                v-else
                class="mr-2"
              ></b-icon-arrow-clockwise>
              {{ !images.length ? "Create!" : "Regenerate" }}
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
        <b-col cols="12" md="7" lg="8" xl="9" class="pt-3 p-0">
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
            <PhotoWindow
              :url="images[0].url"
              rounded-image
              max-height="unset"
            />
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";
import PhotoService from "@/services/PhotoService";
import PhotoListItem from "../PhotoViewer/PhotoListItem.vue";
import PhotoWindow from "../components/PhotoWindow.vue";
import UTDTextArea from "@/components/UTDTextArea";

export default {
  name: "AIArtCreator",
  props: {
    utdCredentials: Object,
    aiArtParams: {
      type: Array,
      default: () => [],
    },
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
      stylePrompts: [],
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

      prompt = this.appendStylePrompts(prompt);

      try {
        this.images = [];
        const UTD = new PhotoService(this.utdCredentials.token);
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

    onStyleSelect(styleParam, stylePrompt) {
      const promptIndex = this.stylePrompts.findIndex(
        (p) => p.prompt === stylePrompt && p.param === styleParam
      );

      if (promptIndex < 0) {
        this.stylePrompts = this.stylePrompts.filter(
          (p) => p.param !== styleParam
        );

        this.stylePrompts.push({
          param: styleParam,
          prompt: stylePrompt,
        });
      } else {
        this.stylePrompts = this.stylePrompts.filter(
          (p) => p.prompt !== stylePrompt && p.param !== styleParam
        );
      }
    },

    isStyleActive(styleParam, stylePrompt) {
      const index = this.stylePrompts.findIndex(
        (p) => p.prompt === stylePrompt && p.param === styleParam
      );

      return index >= 0 ? true : false;
    },

    appendStylePrompts(prompt) {
      this.stylePrompts.forEach((p) => {
        prompt += ", " + p.prompt;
      });

      return prompt;
    },
  },
};
</script>

<style scoped lang="scss">
.utd-utilities__ai-art {
  height: 100%;
  overflow: auto;

  .ai-art-param {
    border-radius: 5px;
    padding: 4px 0;
    img {
      margin-right: 15px;
      height: 30px;
      width: 30px;
      border-radius: 3px;
    }
  }
}
</style>
