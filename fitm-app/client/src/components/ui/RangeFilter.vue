<script setup>
const props = defineProps(["title", "sliderValue", "minVal", "maxVal"]);
defineEmits(["update:sliderValue"]);
</script>
<template>
  <div
    id="range-section"
    class="flex relative flex-col p-2.5 items-center justify-center w-full h-full rounded-lg bg-primaryWhite dark:bg-testColor"
  >
    <h3
      class="mb-2.5 absolute top-2.5 font-poppins-light font-light uppercase tracking-wide"
    >
      Filter by {{ props.title }}
    </h3>
    <div>
      <span>{{ props.sliderValue }}$</span>
    </div>
    <input
      :value="props.sliderValue"
      type="range"
      :min="props.minVal"
      :max="props.maxVal"
      class="appearance-none slider-thumb w-1/2 h-0.5 dark:bg-accentGray rounded outline-none"
      @input="$emit('update:sliderValue', $event.target.value)"
    />
  </div>
</template>
