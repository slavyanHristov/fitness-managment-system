<script setup>
const props = defineProps(["toastMsg", "isToastActive", "toastType"]);
</script>

<template>
  <div class="fixed z-20 -translate-x-1/2 left-1/2">
    <Transition>
      <div
        v-if="props.isToastActive"
        id="toast-wrapper"
        :class="[
          { 'text-green-400 bg-green-100': props.toastType === 'success' },
          { 'text-orange-400 bg-orange-100': props.toastType === 'warning' },
          { 'text-red-400 bg-red-100': props.toastType === 'error' },
        ]"
        class="flex items-center w-full max-w-xs p-4 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      >
        <slot name="icon"></slot>
        <div id="toast-content" class="ml-3 text-sm font-normal">
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
