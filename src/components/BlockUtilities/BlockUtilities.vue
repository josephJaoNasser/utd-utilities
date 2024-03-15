<template>
  <div></div>
</template>

<script>
import BlockService from "@/services/BlocksService";

export default {
  name: "BlockUtilities",
  props: {
    accountId: Number,
    organizationId: Number,
    googleCredentials: Object,
    token: String,
  },
  async mounted() {
    const Blocks = new BlockService(this.token);
    const res = await Blocks.getBlocks();
    console.log(res);
  },
};
</script>

<style lang="scss" scoped></style>
