<template>
  <div class="photo-utilities__nav border-right">
    <div class="position-sticky" style="top: 15px">
      <UTDButton @click="toggleExpandNav" small type="light" class="mb-2">
        <b-icon-list v-if="!expandNav"></b-icon-list>
        <b-icon-x v-else></b-icon-x>
      </UTDButton>
      <div class="border-bottom mb-2 pb-3 position-relative">
        <UTDButton block @click="toggleUploadMenu">
          <b-icon-plus></b-icon-plus>
          <div
            :class="[
              'nav-menu-item-text text-center text-md-left m-0 ml-md-2',
              expandNav ? 'expanded' : '',
            ]"
          >
            Add Media
          </div>
        </UTDButton>
        <ul
          v-if="showUploadMenu"
          class="photo-utilities__nav-dropdown text-primary position-absolute top-0"
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
      <div class="d-flex flex-column">
        <UTDButton
          v-for="item in NavItems"
          type="light"
          :class="[
            'nav-item',
            'mb-2',
            currentUtility === item.value ? 'text-primary' : 'text-secondary',
          ]"
          @click="onUtilityChange(item.value)"
        >
          <b-icon :icon="item.icon"></b-icon>
          <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
            {{ item.label }}
          </div>
        </UTDButton>
      </div>
    </div>
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import UtilityTypes from "@/constants/UtilityTypes";
import navItems from "./navItems";

export default {
  name: "SideNav",
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
  emits: ["utility-change", "uploader-toggled", "create-album-toggled"],
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
  &__nav {
    font-weight: 600;
    padding: 15px 10px;
    background-color: #f1f4f7;
    z-index: 1040;

    &-dropdown {
      list-style: none;
      top: 0;
      right: -110px;
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
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        position: absolute;
        border-right: 10px solid white;
        left: -9.5px;
        top: 9px;
      }
    }

    button {
      display: flex;
      align-items: center;
      gap: 5px;
      text-align: left;
      box-shadow: none;

      &.nav-item {
        background: none;
        border: none;

        &:hover {
          background-color: #dfefff;
        }

        &:focus {
          box-shadow: none;
        }
      }
    }

    .nav-menu-item-text {
      width: 0%;
      height: 0%;
      overflow: hidden;
      display: none;
      transition: all 0.5s;
      margin-left: 12px;

      &.expanded {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
