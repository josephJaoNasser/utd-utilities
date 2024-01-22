<template>
  <b-container
    fluid
    class="p-4 rounded"
    style="background-color: rgb(0, 0, 0, 0.05)"
  >
    <div class="mb-4">
      <div @click="onClose">X</div>
    </div>
    <b-img
      fluid-grow
      class="mb-5"
      :src="photoDetails.url"
      style="margin: 0 auto"
    />
    <b-container fluid class="p-0">
      <b-row align-v="center" class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="title">Title</label>
        </b-col>
        <b-col cols="8">
          <b-form-input
            type="text"
            name="title"
            v-model="fileName"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row align-v="center" class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="caption">Caption</label>
        </b-col>
        <b-col cols="8">
          <b-form-input
            type="text"
            name="caption"
            v-model="caption"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="description">Description</label>
        </b-col>
        <b-col cols="8">
          <b-form-textarea
            no-resize
            rows="4"
            type="text"
            name="description"
            v-model="description"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row align-v="center" class="mb-2">
        <b-col cols="4" class="text-right">
          <label class="mb-0" for="file-url">File URL</label>
        </b-col>
        <b-col cols="8">
          <b-form-input
            type="text"
            name="file-url"
            v-model="url"
          ></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>
<script>
export default {
  name: "Preview",
  props: {
    photoDetails: Object,
  },
  data() {
    const { fileName, url } = this.photoDetails;

    return {
      fileName,
      url,
      caption: "",
      description: "",
    };
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
  },
};
</script>
