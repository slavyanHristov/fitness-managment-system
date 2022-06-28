<script setup>
import { onMounted } from "vue";
import TheHeader from "@/components/layout/TheHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import AutoLogout from "./components/AutoLogout.vue";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "./stores/authStore";

import axios from "axios";

const themeStore = useThemeStore();
themeStore.isThemeInStorage();

const authStore = useAuthStore();

// const refreshToken = async () => {
//   const res = await axios.post(
//     "http://localhost:5000/api/auth/refresh-token",
//     {},
//     {
//       withCredentials: true,
//     }
//   );
//   authStore.setToken(res.data.accessToken);
// };
// refreshToken();

onMounted(() => {
  // refreshToken();
});
</script>

<template>
  <div :class="{ dark: themeStore.getCurrentTheme }" id="main">
    <div
      id="wrapper"
      class="transition-all dark:text-primaryWhite bg-primaryWhite dark:bg-primaryDark"
    >
      <TheHeader />
      <div class="pt-[54px]" id="container">
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
body {
  background-color: red;
  height: 100%;
  min-height: 100%;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}
</style>
