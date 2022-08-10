<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import AuthUserNavItems from "@/components/ui/AuthUserNavItems.vue";
import Logo from "@/components/ui/Logo.vue";
const authStore = useAuthStore();
const loggedInUser = computed(() => {
  return authStore.getUserState.user;
});
</script>

<template>
  <footer class="text-center dark:bg-primaryDark">
    <div class="px-6 pt-12">
      <div class="flex justify-center gap-10 mb-6">
        <img
          class="w-6 h-6 lg:w-10 lg:h-10"
          src="@/assets/icons/facebook.svg"
          alt="facebook"
        />
        <img
          class="w-6 h-6 lg:w-10 lg:h-10"
          src="@/assets/icons/instagram.svg"
          alt="instagram"
        />
        <img
          class="w-6 h-6 lg:w-10 lg:h-10"
          src="@/assets/icons/twitter.svg"
          alt="twitter"
        />
      </div>
      <div class="flex items-center justify-center gap-2">
        <router-link class="uppercase router-views" :to="{ name: 'home' }"
          >Home</router-link
        >
        <router-link class="uppercase router-views" :to="{ name: 'about' }"
          >About</router-link
        >
        <AuthUserNavItems v-if="loggedInUser" :is-flex-column="false" />
      </div>
      <Logo class="py-2" />
      <div class="p-4 text-center">
        © 2022 Copyright: Technical University of Varna
      </div>
      <div class="p-4 text-center uppercase dark:text-darkerWhite font-inter">
        Made by: Slavyan Hristov Hristov, 18621793, SIT
      </div>
    </div>
  </footer>
</template>
