<script setup>
const props = defineProps(["inputValue", "placeholderVal"]);
defineEmits(["update:inputValue"]);
</script>
<template>
  <div id="search-section" class="w-full h-full">
    <div
      class="flex items-center p-2.5 justify-center w-full h-full rounded-lg bg-testColor"
    >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        >
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          :value="props.inputValue"
          type="search"
          class="block p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-primaryGray dark:border-accentGray dark:placeholder-gray-400 dark:text-white"
          :placeholder="props.placeholderVal"
          @input="$emit('update:inputValue', $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>
