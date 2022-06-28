<script setup>
const props = defineProps(["buttonText"]);
</script>

<template>
  <button
    class="inline-block w-full py-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md bg-primaryBlue px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
  >
    {{ props.buttonText }}
  </button>
</template>
