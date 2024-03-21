<template>
  <div class="h-100" style="z-index: 1040">
    <MobileNav class="d-sm-none" @back="$emit('back')" />

    <SideNav class="d-none d-sm-block" @back="$emit('back')" />
  </div>
</template>

<script>
import SideNav from "./SideNav";
import MobileNav from "./MobileNav";
import navItems from "./navItems";
import { photoUtilities } from "@/constants/UtilityTypes";

export default {
  name: "NavMenu",
  components: {
    SideNav,
    MobileNav,
  },
  props: {
    currentUtility: String,
    googleCredentials: Object,
    disableBack: Boolean,
    isGoogleMultiSelect: Boolean,
    extensions: {
      type: Array,
      default: () => [],
    },
    disabledUtilities: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    "utility-change",
    "uploader-toggled",
    "create-album-toggled",
    "google-picker-pick",
    "back",
  ],
  data() {
    return {
      showUploadMenu: false,
    };
  },
  methods: {
    onUtilityChange(type) {
      this.$emit("utility-change", type);
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

    handleGooglePickerPick(e) {
      this.$emit("google-picker-pick", e);
    },
  },
  computed: {
    enabledUtilities() {
      const formattedExtenssions = this.extensions.map((ext) => ({
        label: ext.label,
        icon: ext.icon,
        value: ext.label,
      }));
      
      navItems = [...navItems, ...formattedExtenssions];

      return navItems.filter(
        (navItem) => !this.disabledUtilities.includes(navItem.value)
      );
    },
  },
  provide() {
    return {
      navProps: () => ({
        currentUtility: this.currentUtility,
        googleCredentials: this.googleCredentials,
        disableBack: this.disableBack,
        disabledUtilities: this.disabledUtilities,
        showUploadMenu: this.showUploadMenu,
        isGoogleMultiSelect: this.isGoogleMultiSelect,
        UtilityTypes: photoUtilities,
        enabledUtilities: this.enabledUtilities,
      }),
      navEvents: {
        onUtilityChange: this.onUtilityChange,
        toggleUploadMenu: this.toggleUploadMenu,
        toggleCreateAlbum: this.toggleCreateAlbum,
        toggleUploader: this.toggleUploader,
        handleGooglePickerPick: this.handleGooglePickerPick,
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
