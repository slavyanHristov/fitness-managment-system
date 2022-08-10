<script setup>
import { ref, onMounted, inject } from "vue";

import Modal from "@/components/ui/Modal.vue";
import InstructorService from "@/services/API-calls/InstructorService";
import AddExercise from "./AddExercise.vue";
import RemoveIcon from "@/components/icons/RemoveIcon.vue";
import AddIcon from "@/components/icons/AddIcon.vue";
import NotFoundResource from "@/components/ui/NotFoundResource.vue";

const props = defineProps(["collection"]);
const apiUrlPath = inject("apiUrlPath");
const emit = defineEmits(["refrestItems"]);
const isModalOpen = ref(false);
const exerciseCollection = ref(null);
const workoutId = ref(null);
const addExercise = (id) => {
  console.log("Added " + id);
  workoutId.value = id;
  isModalOpen.value = true;
};

const deleteAction = async (id) => {
  try {
    const response = await InstructorService.deleteExerciseFromWorkout(id);
    console.log(response);
    emit("refrestItems");
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div class="">
    <div v-if="props.collection" class="">
      <Modal
        :open="isModalOpen"
        header-title="Add Exercise To Workout"
        :is-closable-modal="true"
        @close-modal="isModalOpen = !isModalOpen"
      >
        <AddExercise
          :workout-id="workoutId"
          @refresh-items="emit('refrestItems')"
          @close-modal="isModalOpen = false"
        />
        <!-- <CreateWorkout
          :routine-id="routineId"
          @close-modal="isModalOpen = !isModalOpen"
          @refresh-items="getExercisesInWorkout"
        /> -->
      </Modal>
      <div v-if="!props.collection.length">
        <NotFoundResource title="No workouts in the routine yet." />
      </div>
      <div
        v-for="workout in props.collection"
        :key="workout.id"
        class="w-full mb-5"
      >
        <div
          class="w-full px-6 py-2 rounded-t-lg bg-gradient-to-t from-primaryBlue to-accentBlue"
        >
          <h1 class="text-3xl font-bold tracking-wider uppercase font-poppins">
            {{ workout.name }}
          </h1>
        </div>
        <!-- <div class="flex justify-between w-full bg-testColor">
          <div class="w-20"></div>
          <div class="text-center">Exercise Name</div>
          <div class="">Sets</div>
          <div class="">Reps</div>
        </div> -->

        <table class="w-full border-collapse font-poppins">
          <thead class="">
            <tr
              class="font-bold text-center bg-primaryBgWhite dark:bg-accentDark"
            >
              <th class="px-4 py-1"></th>
              <th class="px-4 py-1">Exercise Name</th>
              <th class="px-4 py-1">Muscle Group</th>
              <th class="px-4 py-1">Sets</th>
              <th class="px-4 py-1">Reps</th>
              <th class="px-4 py-1">#</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="exercise in workout.exercises"
              :key="exercise.id"
              class="text-center bg-accentWhite dark:bg-testColor"
            >
              <td class="px-4 py-2">
                <img
                  class="w-20 h-16 rounded-lg"
                  :src="apiUrlPath + exercise.image.path"
                  alt=""
                />
              </td>
              <td class="px-4 py-2">{{ exercise.name }}</td>
              <td class="px-4 py-2">{{ exercise.muscle_group.name }}</td>
              <td class="px-4 py-2">
                {{ exercise.exercise_has_workout.sets }}
              </td>
              <td class="px-4 py-2">
                {{ exercise.exercise_has_workout.reps }}
              </td>
              <td class="px-4 py-2 cursor-pointer">
                <RemoveIcon
                  class="text-red-500 transition-colors hover:text-red-400"
                  @click="deleteAction(exercise.exercise_has_workout.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <div v-for="exercise in workout.exercises" :key="exercise.id">
          <div class="flex items-center justify-between w-full">
            <img
              class="w-20 h-16"
              :src="apiUrlPath + exercise.image.path"
              alt=""
            />
            <span>{{ exercise.name }}</span>
            <span class="w-4">{{ exercise.exercise_has_workout.sets }}</span>
            <span>{{ exercise.exercise_has_workout.reps }}</span>
          </div>
        </div> -->
        <button
          class="flex items-center justify-center w-full gap-2 py-2 text-xl font-bold text-center uppercase transition-all rounded-b-lg group text-primaryDark bg-gradient-to-t from-primaryGreen to-accentGreen"
          @click="addExercise(workout.id)"
        >
          <AddIcon class="transition-colors group-hover:text-primaryBlue" />
          <p class="tracking-wider">Add Exercise</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
