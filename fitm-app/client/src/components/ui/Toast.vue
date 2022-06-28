<script setup>
import WarningIcon from "../icons/WarningIcon.vue";
const props = defineProps(["toastMsg", "isToastActive"]);
</script>

<template>
  <div class="fixed -translate-x-1/2 left-1/2">
    <Transition>
      <div
        class="flex items-center w-full max-w-xs p-4 text-orange-400 bg-orange-100 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
        v-if="props.isToastActive"
        id="toast-wrapper"
      >
        <WarningIcon />
        <div class="ml-3 text-sm font-normal" id="toast-content">
          {{ props.toastMsg }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
