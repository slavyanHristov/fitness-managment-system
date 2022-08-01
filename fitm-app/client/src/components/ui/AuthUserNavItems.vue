<script setup>
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();

defineEmits(["closeMobileNav"]);
</script>

<template>
  <main>
    <div v-if="authStore.isUserLoggedIn" class="flex items-center">
      <div v-if="authStore.isCurrentUserAdmin" class="flex">
        <router-link
          class="router-views"
          :to="{ name: 'adminDashboard' }"
          @click="$emit('closeMobileNav')"
          >A-Dashboard</router-link
        >
      </div>
      <div v-if="authStore.isCurrentUserManager">
        <router-link
          class="router-views"
          :to="{ name: 'managerDashboard' }"
          @click="$emit('closeMobileNav')"
          >M-Dashboard</router-link
        >
      </div>
      <div v-if="authStore.isCurrentUserInstructor">
        <router-link
          class="router-views"
          :to="{ name: 'instructorDashboard' }"
          @click="$emit('closeMobileNav')"
          >F-Dashboard</router-link
        >
      </div>
      <div v-if="authStore.isCurrentUserClient">
        <router-link
          class="router-views"
          :to="{ name: 'clientDashboard' }"
          @click="$emit('closeMobileNav')"
          >C-Dashboard</router-link
        >
      </div>
    </div>
  </main>
</template>
