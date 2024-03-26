<template>
  <div class="photo-utilities__nav border-right">
    <div
      class="position-sticky d-flex flex-column justify-content-between h-100"
      style="top: 15px"
    >
      <div>
        <div class="border-bottom pb-2 mb-2">
          <UTDButton
            :disabled="props.disableBack"
            small
            type="light"
            class="mb-2 w-100"
            :style="props.disableBack ? 'opacity: 0.2' : ''"
            @click="$emit('back')"
          >
            <b-icon-chevron-left></b-icon-chevron-left>
            <div
              :class="[
                'nav-menu-item-text text-center text-md-left m-0 ml-md-2',
                expandNav ? 'expanded' : '',
              ]"
            >
              Go back
            </div>
          </UTDButton>
        </div>
        <div class="border-bottom mb-2 pb-2 position-relative">
          <UTDButton block @click="navEvents.toggleUploadMenu">
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
          <UploadMenu
            v-if="props.showUploadMenu"
            class="photo-utilities__nav-dropdown text-primary position-absolute top-0"
          />
        </div>
        <div class="d-flex flex-column">
          <UTDButton
            v-for="item in props.enabledUtilities"
            type="light"
            :class="[
              'nav-item',
              'mb-2',
              props.currentUtility === item.value ? 'text-primary' : 'text-secondary',
            ]"
            @click="navEvents.onUtilityChange(item.value)"
          >
            <b-icon :icon="item.icon"></b-icon>
            <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
              {{ item.label }}
            </div>
          </UTDButton>
          <div class="py-2 border-top">
            <GooglePickerButton
              type="light"
              :class="['nav-item', 'mb-2', 'text-secondary']"
              :credentials="props.googleCredentials"
              :multi-select="props.isGoogleMultiSelect"
              @picked="navEvents.handleGooglePickerPick"
            >
              <b-icon-google></b-icon-google>
              <div :class="['nav-menu-item-text', expandNav ? 'expanded' : '']">
                Google Drive
              </div>
            </GooglePickerButton>
          </div>
        </div>
      </div>
      <UTDButton
        @click="expandNav = !expandNav"
        small
        type="light"
        class="mb-2 text-center"
      >
        <b-icon-list v-if="!expandNav"></b-icon-list>
        <b-icon-x v-else></b-icon-x>
      </UTDButton>
    </div>
  </div>
</template>

<script>
import UTDButton from "@/components/UTDButton/UTDButton.vue";
import GooglePickerButton from "./GooglePickerButton.vue";
import UploadMenu from "./UploadMenu.vue";

export default {
  name: "SideNav",
  components: { UTDButton, UploadMenu, GooglePickerButton },
  data() {
    return {
      expandNav: true,
    };
  },
  mounted() {
    this.checkBreakpoint();
    window.addEventListener("resize", this.checkBreakpoint);
  },
  computed: {
    props() {
      return this.navProps();
    },
  },
  methods: {
    checkBreakpoint() {
      this.expandNav = window.innerWidth >= 992;
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkBreakpoint);
  },
  inject: ["navProps", "navEvents"],
};
</script>

<style lang="scss" scoped>
.photo-utilities {
  &__nav {
    font-weight: 600;
    padding: 15px 10px;
    background-color: #f1f4f7;
    z-index: 1040;
    height: 100%;

    &-dropdown {
      list-style: none;
      z-index: 1040;
      top: 0;
      left: 45px;
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
