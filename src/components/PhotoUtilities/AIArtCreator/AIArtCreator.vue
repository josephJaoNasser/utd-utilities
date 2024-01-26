<template>
  <div>
    <h2>Create AI Art</h2>
    <p>Create AI Art with our free AI image generator.</p>
    <b-row>
      <b-col cols="12" lg="7" class="mb-2">
        <UTDInput v-model="prompt" placeholder="What do you want to create?" />
      </b-col>
      <b-col cols="12" lg="5">
        <UTDButton class="mr-2 mb-2" @click="getAIArt"
          >Generate Images</UTDButton
        >
        <UTDButton class="mr-2 mb-2" @click="getAIArt(true)"
          >Create random image</UTDButton
        >
      </b-col>
    </b-row>
    <div v-if="imageGenMarkup.length">
      <iframe class="h-100 w-100 border-0" :srcdoc="imageGenMarkup"></iframe>
    </div>
  </div>
</template>
<script>
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";
import UTDService from "@/services/UTDService";

export default {
  name: "AIArtCreator",
  props: {
    token: String,
  },
  components: { UTDInput, UTDButton },
  data() {
    return {
      prompt: "",
      imageGenMarkup: "",
    };
  },
  methods: {
    async getAIArt(random) {
      let prompt = this.prompt;

      if (random) {
        prompt = "Create a random image";
      }

      try {
        const res = await UTDService.generateAIImages(prompt, {
          token: this.token,
          accountId: 11,
        });

        this.imageGenMarkup = res;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
