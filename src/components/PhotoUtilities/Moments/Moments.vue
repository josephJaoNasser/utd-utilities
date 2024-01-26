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

    <b-container v-if="!selectedAlbum">
      <div v-if="isMomentsLoading">Loading moments...</div>
      <b-col class="px-0">
        <b-row cols="1" cols-md="2" cols-lg="3" no-gutters>
          <b-col
            v-for="album in filteredMoments"
            :key="album.id"
            class="p-2"
            @click="selectedAlbum = album.id"
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

    <b-container v-else>
      <div class="mb-4">
        <UTDButton @click="selectedAlbum = null" type="light">
          <b-icon-chevron-left></b-icon-chevron-left>
        </UTDButton>
      </div>
    </b-container>
  </b-row>
</template>

<script>
import UTDInput from "@/components/UTDInput";
import UTDService from "@/services/UTDService.js";
import UTDButton from "@/components/UTDButton";

export default {
  name: "Moments",
  props: {
    defaultMoments: {
      type: Array,
      default: () => [],
    },
    token: String,
    accountId: Number,
  },
  components: { UTDInput, UTDService },
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
      try {
        const UTD = new UTDService(this.token);
        const { payload } = await UTD.getMoments(this.accountId);

        this.moments = payload;
        this.$emit("load", payload);
      } catch (e) {
        console.log(e);
      }
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