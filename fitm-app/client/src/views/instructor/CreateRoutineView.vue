<script setup>
import { ref } from "vue";
import RoutinesContainer from "@/components/ui/instructor-components/RoutinesContainer.vue";
import InstructorService from "@/services/API-calls/InstructorService";
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
</script>
<template>
  <div>
    <Suspense>
      <template #default>
        <RoutinesContainer :async-action="getYourRoutines" />
      </template>
      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>
