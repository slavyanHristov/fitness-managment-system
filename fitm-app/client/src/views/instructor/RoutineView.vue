<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import InstructorService from "@/services/API-calls/InstructorService";
import Spinner from "@/components/ui/Spinner.vue";
import Modal from "@/components/ui/Modal.vue";
import CreateWorkout from "@/components/ui/instructor-components/CreateWorkout.vue";
import WorkoutContainer from "@/components/ui/instructor-components/WorkoutContainer.vue";

const route = useRoute();
const router = useRouter();
const routineId = route.params.id;
const routineData = ref(null);
const workoutsCollection = ref(null);
const isModalOpen = ref(false);
const exerciseCollection = ref(null);

// const getRoutine = async () => {
//   try {
//     const response = await InstructorService.getRoutine(routineId);
//     routineData.value = response.data.item;
//     console.log(response);
//   } catch (err) {
//     console.log(err);
//     router.push({ name: "notFound" });
//   }
// };
// const getWorkouts = async () => {
//   try {
//     const response = await InstructorService.getWorkouts(routineId);
//     workoutsCollection.value = response.data.collection;
//     console.log(workoutsCollection);
//   } catch (err) {
//     console.log(err);
//   }
// };
const getRoutine = async () => {
  try {
    const response = await InstructorService.getRoutine(routineId);
    routineData.value = response.data.collection;
    console.log(routineData.value);
  } catch (err) {
    console.log(err);
    router.push({ name: "notFound" });
  }
};

onMounted(async () => {
  //   await getRoutine();
  //   await getWorkouts();
  await getRoutine();
});
</script>
<template>
  <div class="">
    <Modal
      :open="isModalOpen"
      header-title="Create Workout"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <CreateWorkout
        :routine-id="routineId"
        @close-modal="isModalOpen = !isModalOpen"
        @refresh-items="getRoutine"
      />
    </Modal>
    <div v-if="routineData" class="flex flex-col items-center justify-center">
      <h1>{{ routineData.name }}</h1>
      <button @click="isModalOpen = true">Create Workout</button>
      <WorkoutContainer
        class="w-11/12"
        :collection="routineData.workouts"
        @refrest-items="getRoutine"
      />
    </div>
    <!-- <div v-if="exerciseCollection">
      <h1>{{ exerciseCollection.name }}</h1>
      <button @click="isModalOpen = true">Create Workout</button>
      <div
        v-for="workout in exerciseCollection.workouts"
        :key="workout.id"
        class="mb-5"
      >
        <div>
          <span>{{ workout.name }}</span>
        </div>
        <div v-for="exercise in workout.exercises" :key="exercise.id">
          {{ exercise.name }}
          {{ exercise.exercise_has_workout.sets }}
          {{ exercise.exercise_has_workout.reps }}
        </div>
        <button @click="addExercise(workout.id)">Add Exercise</button>
      </div>
    </div> -->
    <div v-else><Spinner :is-active="true" /></div>
  </div>
</template>
