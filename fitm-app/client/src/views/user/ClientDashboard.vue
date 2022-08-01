<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div>
    <div>
      <h1 class="text-center text-red-500">Welcome, Client!</h1>
      <button @click="router.push({ name: 'clientRoutine' })">
        My Routine
      </button>
      <button @click="router.push({ name: 'clientMealPlan' })">
        My Meal Plan
      </button>
    </div>
  </div>
</template>
