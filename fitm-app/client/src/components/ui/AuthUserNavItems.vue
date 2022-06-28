<script setup>
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();

defineEmits(["closeMobileNav"]);
</script>

<template>
  <div v-if="authStore.isCurrentUserAdmin">
    <router-link
      @click="$emit('closeMobileNav')"
      class="router-views"
      :to="{ name: 'adminDashboard' }"
      >A-Dashboard</router-link
    >
  </div>
  <div v-if="authStore.isCurrentUserManager">
    <router-link
      @click="$emit('closeMobileNav')"
      class="router-views"
      :to="{ name: 'managerDashboard' }"
      >M-Dashboard</router-link
    >
  </div>
</template>
