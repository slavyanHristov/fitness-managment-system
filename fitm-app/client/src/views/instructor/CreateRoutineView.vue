<script setup>
import { ref } from "vue";
// import Modal from "@/components/ui/Modal.vue";
// import CreateRoutine from "@/components/ui/CreateRoutine.vue";
import RoutinesContainer from "@/components/ui/RoutinesContainer.vue";
import InstructorService from "@/services/API-calls/InstructorService";
const isModalOpen = ref(false);
// const emit = defineEmits(["refreshItems"]);
const collection = ref(null);
const getYourRoutines = async () => {
  try {
    const response = await InstructorService.getYourRoutines();
    collection.value = response.data.collection;
    console.log(collection.value);
    return collection.value;
  } catch (err) {
    console.log(err);
  }
};

// const asd = () => {
//   emit("refreshItems");
// };

// const exampleColl = ref(["asd", "fasd"]);
</script>
<template>
  <div>
    <!-- <div>
      <button @click="isModalOpen = true">Create Fitness Routine</button>
    </div> -->
    <Suspense>
      <template #default>
        <RoutinesContainer :async-action="getYourRoutines" />
      </template>
      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>
