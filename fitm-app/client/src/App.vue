<script setup>
import TheHeader from "@/components/layout/TheHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import AutoLogout from "./components/AutoLogout.vue";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "./stores/authStore";

const themeStore = useThemeStore();
themeStore.isThemeInStorage();
const authStore = useAuthStore();
</script>

<template>
  <div id="main" :class="{ dark: themeStore.getCurrentTheme }">
    <div
      id="wrapper"
      class="transition-all dark:text-primaryWhite bg-primaryWhite dark:bg-primaryDark"
    >
      <TheHeader />
      <div id="container" class="pt-[54px]">
        <AutoLogout v-if="authStore.isCurrentUserAdminOrManager" />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.name" />
          </transition>
        </router-view>
      </div>
      <TheFooter />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}
</style>
