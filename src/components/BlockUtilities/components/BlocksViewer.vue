<template>
  <b-container fluid>
    <b-row cols="2" cols-sm="3" cols-md="4" cols-lg="5" cols-xl="6">
      <div v-for="block in blocks" class="p-2">
        <b-col class="border p-0">
          <div class="border-bottom">
            <b-img
              lazy
              :src="block.screenshot"
              class="w-100"
              style="height: 200px; object-fit: contain"
            />
          </div>
          <p class="p-2">{{ block.name }}</p>
        </b-col>
      </div>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "BlocksViewer",
  props: {
    blocks: {
      type: Array,
      defailt: () => [],
    },
  },
};
</script>

<style lang="scss" scoped></style>
