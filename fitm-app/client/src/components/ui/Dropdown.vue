<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const logoutAction = async () => {
  if (authStore.getUserState.status.isLoggedIn) {
    await authStore.logout();
    router.push({ name: "home" });
  }
};
</script>
<template>
  <div
    id="menu"
    class="absolute text-sm border-2 rounded-md dark:border-primaryGray bg-primaryBgWhite dark:bg-accentDark font-inter top-10"
  >
    <div class="flex flex-col items-center justify-center min-w-[8rem]">
      <router-link
        class="w-full py-2 text-center border-b border-primaryGray"
        :to="{ name: 'myProfile' }"
        >My Profile</router-link
      >
      <router-link
        v-if="authStore.getCurrentUser?.userRole?.membership"
        class="w-full py-2 text-center border-b border-primaryGray"
        :to="{ name: 'clientMembership' }"
        >My Membership</router-link
      >
      <button class="py-2" @click="logoutAction">Log out</button>
    </div>
  </div>
</template>
