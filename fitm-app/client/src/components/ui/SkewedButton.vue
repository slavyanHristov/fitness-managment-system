<script setup>
const props = defineProps(["buttonText"]);
</script>

<template>
  <button class="-skew-x-[45deg] transition-all hover:-translate-y-1">
    <span
      class="inline-block px-6 py-1 text-lg font-poppins font-extrabold uppercase skew-x-[45deg]"
      >{{ props.buttonText }}</span
    >
  </button>
</template>
