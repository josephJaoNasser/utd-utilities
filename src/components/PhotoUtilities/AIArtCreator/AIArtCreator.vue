<template>
  <div>
    <h2>Create AI Art</h2>
    <p>Create AI Art with our free AI image generator.</p>
    <UTDInput v-model="prompt" placeholder="What do you want to create?" />
    <UTDButton class="mt-2" @click="getAIArt">Generate Images</UTDButton>
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
    async getAIArt() {
      try {
        const res = await UTDService.generateAIImages(this.prompt, {
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
