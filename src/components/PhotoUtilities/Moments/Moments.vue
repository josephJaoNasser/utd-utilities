<template>
  <b-container
    fluid
    class="position-relative utd-utilities__albums px-0"
    :style="!selectedAlbum && 'overflow: auto;'"
  >
    <b-container
      fluid
      class="sticky-top pt-3 border-bottom"
      v-if="!selectedAlbum"
      style="background-color: white"
    >
      <div class="mb-3">
        <h2 class="font-weight-bold">Moments</h2>
      </div>
    </b-container>

    <b-container fluid v-if="!selectedAlbum" class="h-100">
      <b-container fluid class="text-center mb-3 p-4" v-if="isMomentsLoading">
        <b-spinner label="Loading..." variant="primary" type="grow"></b-spinner>
      </b-container>
      <b-col v-else class="px-0">
        <b-container fluid v-if="!moments.length">
          <p class="text-center p-4">
            <i> You have no moments... </i>
          </p>
        </b-container>
        <b-row cols="1" cols-md="2" cols-lg="3" no-gutters>
          <b-col
            v-for="album in filteredMoments"
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
  </b-container>
</template>

<script>
import UTDInput from "@/components/UTDInput";
import PhotoService from "@/services/PhotoService.js";
import UTDButton from "@/components/UTDButton";
import AlbumViewer from "../Albums/AlbumViewer.vue";

export default {
  name: "Moments",
  props: {
    utdCredentials: Object,
    defaultMoments: {
      type: Array,
      default: () => [],
    },
  },
  components: { UTDInput, PhotoService, UTDButton, AlbumViewer },
  emits: ["load"],
  data() {
    return {
      moments: this.defaultMoments,
      isMomentsLoading: false,
      selectedAlbum: null,
      searchString: "",
    };
  },
  methods: {
    async getMoments() {
      this.isMomentsLoading = true;
      try {
        const UTD = new PhotoService(this.utdCredentials.token);
        const { payload } = await UTD.getMoments(this.utdCredentials.userId);

        this.moments = payload;
        this.$emit("load", payload);
      } catch (e) {
        console.log(e);
      }
      this.isMomentsLoading = false;
    },
  },
  computed: {
    filteredMoments() {
      if (!this.searchString.length) {
        return this.moments;
      }
      const searchLowerCase = this.searchString.toLowerCase();

      const filteredList = this.moments.filter((album) =>
        album.albumName.toLowerCase().includes(searchLowerCase)
      );

      return filteredList;
    },
  },
  async mounted() {
    if (!this.defaultMoments?.length) {
      await this.getMoments();
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
      justify-content: end;
    }
  }
}
</style>
