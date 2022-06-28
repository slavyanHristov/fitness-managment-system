<script setup>
defineEmits(["closeMobileNav"]);
</script>

<template>
  <div>
    <router-link
      @click="$emit('closeMobileNav')"
      class="router-views"
      :to="{ name: 'managerDashboard' }"
      >M-Dashboard</router-link
    >
  </div>
</template>
