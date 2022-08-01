<script setup>
const props = defineProps(["cost", "title", "description", "color"]);
const emit = defineEmits(["onButtonClick"]);
console.log(props.color);
</script>

<template>
  <div class="w-1/2 mx-6 my-6 bg-primaryBgWhite dark:bg-accentDark">
    <header :style="'background-color: ' + props.color + ';'">
      <h1 class="py-2 font-bold text-center text-black font-poppins">
        {{ props.title }}
      </h1>
    </header>
    <main class="h-full bg-primaryBgWhite dark:bg-accentDark">
      <div
        :style="'border-color: ' + props.color + ';'"
        class="flex items-center justify-center w-20 h-20 mx-auto my-6 text-center border-4 border-solid rounded-full"
      >
        <span class="font-bold dark:text-primaryWhite font-poppins"
          >{{ props.cost }}$</span
        >
      </div>
      <div
        id="description"
        class="flex items-center justify-center py-12 dark:text-primaryWhite"
      >
        {{ props.description }}
      </div>
    </main>
    <footer :style="'background-color: ' + props.color + ';'">
      <button
        class="w-full py-2 text-lg font-bold text-black font-poppins"
        @click="emit('onButtonClick')"
      >
        Buy Now
      </button>
    </footer>
  </div>
</template>
