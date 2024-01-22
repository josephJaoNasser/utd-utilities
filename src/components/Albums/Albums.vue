<template>
  <b-row>
    <div v-if="isAlbumsLoading">Loading albums...</div>
    <b-col>
      <b-row cols-md="2" cols-lg="3" no-gutters>
        <b-col v-for="album in albums" :key="album.id" class="p-2">
          <div class="card text-white">
            <img :src="album.albumImage" class="card-img" />
            <div class="card-img-overlay">
              <h5 class="card-title">
                {{
                  album.albumName.length ? album.albumName : "Untitled Album"
                }}
              </h5>
              <p class="card-text">
                {{ album.albumDescription }}
              </p>
              <p class="card-text">Last updated 3 mins ago</p>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import UTDService from "@/services/UTDService.js";

export default {
  name: "Albums",
  props: {
    token: String,
    accountId: Number,
  },
  data() {
    return {
      albums: [],
      isAlbumsLoading: false,
    };
  },
  methods: {
    async getAlbums() {
      try {
        const UTD = new UTDService(this.token);
        const { payload } = await UTD.getAlbums(this.accountId);
        this.albums = payload;
      } catch (e) {
        console.log(e);
      }
    },
  },
  async mounted() {
    await this.getAlbums();
  },
};
</script>
