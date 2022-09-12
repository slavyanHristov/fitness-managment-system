<script setup>
import { ref } from "vue";
const props = defineProps(["sortCollection", "collection"]);

let activeItem = ref(null);

const selectItem = (index) => {
  activeItem.value = index;
};
</script>
<template>
  <div
    id="sort"
    class="flex p-1.5 flex-col items-center justify-center w-full h-full rounded-lg bg-primaryWhite dark:bg-testColor"
  >
    <h3 class="mb-1.5 font-poppins-light font-light uppercase tracking-wide">
      Sort by
    </h3>
    <div id="buttons" class="flex mb-2.5 flex-col items-center justify-center">
      <div
        v-for="item in props.sortCollection"
        :key="item.id"
        :class="
          item.id === activeItem
            ? 'bg-blue-500'
            : 'bg-primaryBgWhite dark:bg-accentGray'
        "
        class="flex justify-center w-full border-b border-primaryDark first:rounded-t last:rounded-b last:border-b-0"
      >
        <button
          @click="
            selectItem(item.id);
            item.action(props.collection, item.column);
          "
        >
          <span class="text-sm font-normal px-2.5 font-poppins-normal">{{
            item.name
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
