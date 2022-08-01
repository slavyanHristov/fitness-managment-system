<script setup>
defineEmits(["closeMobileNav"]);
</script>

<template>
  <div>
    <router-link
      class="router-views"
      :to="{ name: 'managerDashboard' }"
      @click="$emit('closeMobileNav')"
      >M-Dashboard</router-link
    >
  </div>
</template>
