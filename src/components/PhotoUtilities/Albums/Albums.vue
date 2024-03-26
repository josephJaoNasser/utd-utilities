<template>
  <b-container
    fluid
    class="position-relative utd-utilities__albums px-0"
    style="overflow: auto"
  >
    <b-container
      fluid
      class="sticky-top pt-3 border-bottom"
      style="background-color: white"
    >
      <div class="mb-3">
        <h2 class="font-weight-bold">Albums</h2>
      </div>
    </b-container>

    <b-container fluid class="h-100">
      <b-container fluid class="text-center mb-3 p-4" v-if="isAlbumsLoading">
        <b-spinner label="Loading..." variant="primary" type="grow"></b-spinner>
      </b-container>
      <b-col class="px-0" v-else>
        <b-container fluid v-if="!albums.length">
          <p class="text-center p-4">
            <i> You have no albums... </i>
            <br /><br />
            <UTDButton @click="$emit('create-album-toggle')">
              <b-icon-plus></b-icon-plus>
              Create an album
            </UTDButton>
          </p>
        </b-container>
        <b-row cols="1" cols-md="2" cols-lg="3" no-gutters>
          <b-col
            v-for="album in albums"
            :key="album.id"
            class="p-2"
            @click="$emit('album-select', album)"
          >
            <div class="card bg-dark text-white border-0 utd-utilities__album">
              <div class="position-relative img-container">
                <div class="album-bg-overlay absolute"></div>
                <img class="card-img" :src="album.albumImage" />
              </div>
              <div class="card-img-overlay p-0">
                <div class="card-body h-100">
                  <h5 class="card-title">
                    {{
                      album.albumName?.length
                        ? album.albumName
                        : "Untitled Album"
                    }}
                  </h5>
                  <p class="card-text text-truncate">
                    {{ album.albumDescription }}
                  </p>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-container>
  </b-container>
</template>

<script>
import UTDButton from "@/components/UTDButton";
import UTDInput from "@/components/UTDInput";
import PhotoService from "@/services/PhotoService.js";

export default {
  name: "Albums",
  props: {
    utdCredentials: Object,
    defaultAlbums: {
      type: Array,
      default: () => [],
    },
  },
  components: { UTDInput, UTDButton },
  emits: ["load", "create-album-toggle"],
  data() {
    return {
      albums: this.defaultAlbums,
      showCreateAlbum: false,
      isAlbumsLoading: false,
    };
  },
  methods: {
    async getAlbums() {
      this.isAlbumsLoading = true;
      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const { payload } = await UTD.getAlbums(this.utdCredentials.userId);
        this.albums = payload;
        this.$emit("load", payload);
      } catch (e) {
        console.log(e);
      }
      this.isAlbumsLoading = false;
    },
  },
  watch: {
    defaultAlbums: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.albums = newVal;
      },
    },
  },
  async mounted() {
    if (!this.defaultAlbums?.length) {
      await this.getAlbums();
    }
  },
};
</script>

<style scoped lang="scss">
.utd-utilities {
  &__albums {
    height: 100%;
  }

  &__album {
    cursor: pointer;
    height: 200px;
    overflow: hidden;

    & > .img-container {
      height: 100%;

      .album-bg-overlay {
        background-image: linear-gradient(
          to bottom,
          rgba(245, 246, 252, 0),
          rgba(0, 0, 0, 0.73)
        );
        height: 100%;
        width: 100%;
        position: absolute;
      }

      img {
        height: 100%;
        object-fit: cover;
      }
    }

    &:hover .card-img {
      transform: scale(1.2);
    }

    .card-img {
      transition: transform 0.5s ease;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .card-title {
        margin-bottom: 0;
      }
    }
  }
}
</style>
