<template>
  <div class="photo-utilities__mobile-nav d-flex justify-content-between">
    <UTDButton small type="light" @click="$emit('back')">
      <b-icon-chevron-left></b-icon-chevron-left>
    </UTDButton>
    <div class="d-flex">
      <div class="mobile-nav-items">
        <UTDButton
          v-for="item in NavItems"
          type="light"
          :class="[
            'nav-item',
            currentUtility === item.value ? 'text-primary' : 'text-secondary',
          ]"
          @click="onUtilityChange(item.value)"
        >
          <b-icon :icon="item.icon"></b-icon>
        </UTDButton>
      </div>
      <div class="position-relative">
        <div>
          <div class="border-left pl-2 ml-2">
            <UTDButton block @click="toggleUploadMenu">
              <b-icon-plus></b-icon-plus>
            </UTDButton>
          </div>
          <ul
            v-if="showUploadMenu"
            class="photo-utilities__mobile-nav-dropdown text-primary position-absolute top-0"
            style="list-style: none"
          >
            <li>
              <UTDButton
                block
                type="light"
                class="text-primary px-3 py-2"
                @click="toggleUploader"
              >
                <b-icon-image class="mr-2"></b-icon-image>
                Photo
              </UTDButton>
            </li>
            <li>
              <UTDButton
                block
                type="light"
                class="text-primary px-3 py-2"
                @click="toggleCreateAlbum"
              >
                <b-icon-images class="mr-2"></b-icon-images>
                Album
              </UTDButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import UtilityTypes from "@/constants/UtilityTypes";
import navItems from "./navItems";

export default {
  name: "MobileNav",
  components: { UTDButton },
  props: {
    currentUtility: String,
  },
  data() {
    return {
      expandNav: false,
      showUploadMenu: false,
    };
  },
  emits: ["utility-change", "uploader-toggled", "create-album-toggled", "back"],
  methods: {
    onUtilityChange(type) {
      this.$emit("utility-change", type);
    },

    toggleExpandNav() {
      this.expandNav = !this.expandNav;
    },

    toggleUploadMenu() {
      this.showUploadMenu = !this.showUploadMenu;
    },

    toggleCreateAlbum() {
      this.$emit("create-album-toggled");
      this.toggleUploadMenu();
    },

    toggleUploader() {
      this.$emit("uploader-toggled");
      this.toggleUploadMenu();
    },
  },
  computed: {
    UtilityTypes: () => UtilityTypes,
    NavItems: () => navItems,
  },
};
</script>

<style lang="scss" scoped>
.photo-utilities {
  &__mobile-nav {
    position: absolute;
    width: 100%;
    top: 0;
    display: flex;
    z-index: 1040;
    gap: 10px;
    align-items: center;
    padding: 5px;
    background-color: #f1f4f7;
    border: 1px solid #ccc;

    &-dropdown {
      list-style: none;
      top: 45px;
      left: 0;
      background: white;
      padding: 0;
      border-radius: 5px;
      width: max-content;
      -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);
      -moz-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.23);

      button {
        background-color: white;
        border: none;

        &:hover {
          background-color: #efefef;
        }
      }

      &:before {
        content: " ";
        width: 0;
        height: 0;
        border-right: 10px solid white;
        border-top: 10px solid white;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
        position: absolute;
        left: 12.5px;
        bottom: 70px;
        transform: rotate(315deg);
      }
    }

    .mobile-nav-items {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
  }
}
</style>
