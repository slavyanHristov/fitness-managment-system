<script setup>
import NotFoundIcon from "@/components/icons/NotFoundIcon.vue";
const props = defineProps(["title"]);
</script>
<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full gap-4 p-5 rounded-lg bg-darkerWhite dark:bg-testColor"
  >
    <NotFoundIcon />
    <h1 class="uppercase">{{ props.title }}</h1>
  </div>
</template>
