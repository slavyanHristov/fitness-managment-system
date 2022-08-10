<script setup>
import { ref, inject, computed } from "vue";
// import InstructorService from "@/services/API-calls/InstructorService";

const apiUrlPath = inject("apiUrlPath");
const props = defineProps([
  "collection",
  "filteredCollection",
  "itemId",
  "headerCollection",
]);
const emit = defineEmits(["refreshCollection", "onSelectedItem"]);
// const recordData = ref({
//   sets: null,
//   reps: null,
//   exerciseId: null,
//   itemId: props.itemId,
// });
const addItem = async (id) => {
  console.log(id);
  try {
    // recordData.value.sets = 4;
    // recordData.value.reps = 15;
    // recordData.value.exerciseId = id;
    // const response = await InstructorService.addItemToWorkout(
    //   recordData.value
    // );
    emit("onSelectedItem", id);
    // emit("refreshCollection");
  } catch (err) {
    console.log(err);
  }
};

const filteredItem = (item) => {
  const { id, image, ...rest } = item;
  return rest;
};
</script>
<template>
  <div v-if="props.collection" class="grid w-full gap-2 overflow-auto">
    <div v-if="!props.filteredCollection.length">No Result</div>
    <table class="w-full border-collapse font-poppins">
      <thead>
        <tr
          class="text-sm font-bold text-center border-b-4 dark:border-accentDark bg-darkerWhite dark:bg-primaryDark"
        >
          <th class="rounded-l-lg"></th>
          <th
            v-for="(header, index) in props.headerCollection"
            :key="index"
            class="px-4 py-1 last:rounded-r-lg"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in props.filteredCollection"
          :key="item.id"
          class="text-sm transition-colors border-b-4 cursor-pointer hover:bg-darkerWhite hover:dark:bg-accentGray last:border-none solid dark:border-accentDark bg-primaryWhite dark:bg-primaryGray"
          @click="addItem(item.id)"
        >
          <td class="rounded-l-lg">
            <img
              class="w-10 h-10 rounded-md"
              :src="apiUrlPath + item.image.path"
              alt=""
            />
          </td>
          <td
            v-for="key in filteredItem(item)"
            :key="key.id"
            class="last:rounded-r-lg"
          >
            <p class="text-center">{{ key }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
