<script setup>
const props = defineProps(["imgPath", "titleText"]);
</script>
<template>
  <header
    class="flex flex-col justify-end w-full bg-[left_calc(0%)_top_calc(40%)] bg-no-repeat bg-cover h-64"
    :style="{ 'background-image': 'url(' + props.imgPath + ')' }"
  >
    <h1 class="ml-8 text-5xl uppercase drop-shadow-solid font-poppins">
      {{ props.titleText }}
    </h1>
  </header>
</template>
