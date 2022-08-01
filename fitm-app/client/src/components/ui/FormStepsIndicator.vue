<script setup>
const props = defineProps(["totalSteps", "currentStep"]);
</script>

<template>
  <div class="flex items-stretch gap-2">
    <div
      v-for="step in props.totalSteps"
      :key="step.id"
      class="w-full h-3 rounded text-primaryBlue"
      style="border: 1px solid"
      :class="{ 'bg-primaryBlue': step - 1 <= props.currentStep }"
    ></div>
  </div>
</template>
