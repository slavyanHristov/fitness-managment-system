<script setup>
import { ref, computed } from "vue";

defineProps(["sortCollection", "sliderValue",])
let activeItem = ref(null);

const selectItem = (index) => {
  activeItem.value = index;
};

</script>

<template>
    <div>

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
              v-model="search"
              type="search"
              class="block p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-primaryGray dark:border-accentGray dark:placeholder-gray-400 dark:text-white"
              placeholder="Search gyms..."
            />
          </div>
        </div>
      </div>
      <div
        id="sort"
        class="flex p-2.5 flex-col items-center justify-center w-full h-full rounded-lg bg-testColor"
      >
        <h3
          class="mb-2.5 font-poppins-light font-light uppercase tracking-wide"
        >
          Sort by
        </h3>
        <div
          id="buttons"
          class="flex mb-2.5 flex-col items-center justify-center"
        >
          <div
            v-for="item in sortByCollection"
            :key="item.id"
            :class="item.id === activeItem ? 'bg-blue-500' : 'bg-accentGray'"
            class="flex justify-center w-full border-b border-primaryDark first:rounded-t last:rounded-b last:border-b-0"
          >
            <button
              @click="
                selectItem(item.id);
                item.action();
              "
            >
              <span class="text-sm font-normal px-2.5 font-poppins-normal">{{
                item.name
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>