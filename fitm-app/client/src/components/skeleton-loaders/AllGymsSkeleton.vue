<script setup>
import CardSkeleton from "./CardSkeleton.vue";
</script>

<template>
  <div class="w-full">
    <header class="flex flex-col justify-end w-full h-64 dark:bg-accentGray">
      <div
        id="h1"
        class="h-10 ml-8 rounded-full animate-pulse bg-darkerWhite dark:bg-primaryGray w-96"
      ></div>
    </header>
    <div
      class="grid h-40 grid-cols-2 m-5 rounded-lg bg-primaryBgWhite lg:grid-cols-3 dark:bg-accentDark"
    ></div>
    <div
      class="grid gap-4 p-5 m-5 rounded-lg bg-primaryBgWhite place-items-center sm:grid-cols-2 lg:grid-cols-3 dark:bg-accentDark"
    >
      <CardSkeleton v-for="index in 6" :key="index" />
    </div>
  </div>
</template>
