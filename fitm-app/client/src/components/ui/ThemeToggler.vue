<script setup>
import { useThemeStore } from "@/stores/theme";
const store = useThemeStore();

const toggleDarkMode = () => {
  store.switchTheme();
  localStorage.setItem("dark-mode", store.getCurrentTheme);
};
</script>

<template>
  <div>
    <button @click="toggleDarkMode">🌙|🌞</button>
  </div>
</template>
