<script setup>
import { ref, inject, computed } from "vue";
// import InstructorService from "@/services/API-calls/InstructorService";

const apiUrlPath = inject("apiUrlPath");
const props = defineProps(["collection", "filteredCollection", "itemId"]);
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
  <div v-if="props.collection" class="overflow-auto">
    <div v-if="!props.filteredCollection.length">No Result</div>
    <div
      v-for="item in props.filteredCollection"
      :key="item.id"
      class="flex cursor-pointer"
      @click="addItem(item.id)"
    >
      <img class="w-10 h-10" :src="apiUrlPath + item.image.path" alt="" />
      <div v-for="key in filteredItem(item)" :key="key.id">
        <p>{{ key }}</p>
      </div>
    </div>
  </div>
</template>
