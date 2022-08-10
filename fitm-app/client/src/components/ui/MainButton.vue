<script setup>
const props = defineProps(["buttonText"]);
</script>

<template>
  <button
    class="inline-block w-full py-3 text-base font-bold leading-snug uppercase transition duration-150 ease-in-out rounded shadow-md dark:text-white bg-primaryBlue px-7 hover:bg-blue-700 hover:shadow-lg"
  >
    {{ props.buttonText }}
  </button>
</template>
