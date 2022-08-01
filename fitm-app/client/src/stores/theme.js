import { defineStore } from "pinia";

export const useThemeStore = defineStore({
  id: "theme",
  state: () => ({
    isDarkMode: true,
  }),
  getters: {
    getCurrentTheme: (state) => state.isDarkMode,
  },
  actions: {
    switchTheme() {
      this.isDarkMode = !this.isDarkMode;
    },
    isThemeInStorage() {
      this.isDarkMode = localStorage.getItem("dark-mode") == "true";
    },
  },
});
