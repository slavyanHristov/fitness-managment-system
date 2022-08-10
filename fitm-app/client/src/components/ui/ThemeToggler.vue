<script setup>
import SunIcon from "@/components/icons/SunIcon.vue";
import MoonIcon from "@/components/icons/MoonIcon.vue";
import { useThemeStore } from "@/stores/theme";
const store = useThemeStore();

const toggleDarkMode = () => {
  store.switchTheme();
  localStorage.setItem("dark-mode", store.getCurrentTheme);
};
</script>

<template>
  <div id="theme-toggler">
    <button @click="toggleDarkMode">
      <span v-if="store.getCurrentTheme">
        <MoonIcon />
      </span>
      <span v-else>
        <SunIcon />
      </span>
    </button>
  </div>
</template>
