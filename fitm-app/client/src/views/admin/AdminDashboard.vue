<script setup>
import { ref } from "vue";
import AdminService from "@/services/API-calls/AdminService";
</script>

<template>
  <div>
    <div>
      <h1 class="text-center text-red-500">Welcome, Admin!</h1>
    </div>
    <router-link :to="{ name: 'registerManager' }"
      >Register Manager</router-link
    >
    <router-link :to="{ name: 'addGym' }">Add Gym</router-link>
  </div>
</template>
