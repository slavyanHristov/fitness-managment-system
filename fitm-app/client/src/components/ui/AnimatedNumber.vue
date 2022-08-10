<script setup>
import { ref } from "vue";
const props = defineProps(["number"]);
const displayNumber = ref(0);
let timeout = null;

const incrementNumber = () => {
  clearTimeout(timeout);
  if (displayNumber.value === props.number) return;
  if (displayNumber.value < props.number) displayNumber.value++;
  timeout = setTimeout(() => incrementNumber(), 200);
};

incrementNumber();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-1">
    <h1 class="text-3xl font-bold tracking-wider">{{ displayNumber }}</h1>
    <div
      class="w-full h-1 rounded-full bg-primaryDark dark:bg-primaryWhite"
    ></div>
  </div>
</template>
