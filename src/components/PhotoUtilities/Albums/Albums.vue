<template>
  <b-row>
    <b-container>
      <b-row class="mb-4">
        <b-col>
          <UTDInput
            v-model="searchString"
            icon="search"
            class="p-2"
            placeholder="Type to search"
          />
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
    <b-container>
      <div v-if="isAlbumsLoading">Loading albums...</div>
      <b-col class="px-0">
        <b-row cols="1" cols-md="2" cols-lg="3" no-gutters>
          <b-col v-for="album in filteredAlbums" :key="album.id" class="p-2">
            <div class="card bg-dark text-white border-0 utd-utilities__album">
              <div class="position-relative">
                <div class="album-bg-overlay absolute"></div>
                <img class="card-img" :src="album.albumImage" />
              </div>
              <div class="card-img-overlay p-0">
                <div class="card-body h-100">
                  <h5 class="card-title">
                    {{
                      album.albumName.length
                        ? album.albumName
                        : "Untitled Album"
                    }}
                  </h5>
                  <p class="card-text">
                    {{ album.albumDescription }}
                  </p>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-container>
  </b-row>
</template>

<script>
import UTDInput from "@/components/UTDInput";
import UTDService from "@/services/UTDService.js";

export default {
  name: "Albums",
  props: {
    token: String,
    accountId: Number,
  },
  components: { UTDInput },
  data() {
    return {
      albums: [],
      isAlbumsLoading: false,
      searchString: "",
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
  computed: {
    filteredAlbums() {
      if (!this.searchString.length) {
        return this.albums;
      }
      const searchLowerCase = this.searchString.toLowerCase();

      const filteredList = this.albums.filter((album) =>
        album.albumName.toLowerCase().includes(searchLowerCase)
      );

      return filteredList;
    },
  },
  async mounted() {
    await this.getAlbums();
  },
};
</script>

<style scoped lang="scss">
.utd-utilities {
  &__album {
    height: 200px;
    overflow: hidden;

    & > div {
      height: 100%;

      img {
        height: 100%;
        object-fit: cover;
      }
    }

    .card-body {
      display: flex;
      flex-direction: column;
      justify-content: end;
    }
  }
}

.album-bg-overlay {
  background-image: linear-gradient(
    to bottom,
    rgba(245, 246, 252, 0),
    rgba(0, 0, 0, 0.73)
  );
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
