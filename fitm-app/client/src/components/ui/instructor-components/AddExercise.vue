<script setup>
import { ref, onMounted, computed } from "vue";
import InstructorService from "@/services/API-calls/InstructorService";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import SearchFilter from "../SearchFilter.vue";
import InputField from "../InputField.vue";
import ListView from "../ListView.vue";
import { filterByMultiple } from "@/utils/filtrationsAndSorts";

const props = defineProps(["workoutId"]);
const emit = defineEmits(["closeModal", "refreshItems"]);
const exercisesCollection = ref(null);
const search = ref("");

const recordData = ref({
  sets: null,
  reps: null,
  exerciseId: null,
  workoutId: props.workoutId,
});

const rules = computed(() => {
  return {
    sets: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
    reps: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
  };
});

const v$ = useVuelidate(rules, recordData);

const getAllExercises = async () => {
  try {
    const response = await InstructorService.getAllExercises();
    exercisesCollection.value = response.data.collection;
    console.log(response.data.collection);
  } catch (err) {
    console.log(err);
  }
};

const filteredCollection = computed(() => {
  return filterByMultiple(exercisesCollection.value, search.value);
});

const addExerciseToWorkout = async (exerciseId) => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      recordData.value.exerciseId = exerciseId;
      const response = await InstructorService.addExerciseToWorkout(
        recordData.value
      );
      console.log(response);
      emit("refreshItems");
      console.log("Exercise ID", exerciseId);
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getAllExercises();
});
</script>

<template>
  <div v-if="exercisesCollection">
    <h1>HERE I ADD EXERCISES</h1>
    <SearchFilter
      v-model:inputValue="search"
      placeholder-val="Search exercises..."
    />
    <InputField
      v-model:inputContent="recordData.sets"
      input-type="number"
      input-id="sets"
      :vuelidate-errors="v$.sets.$errors"
      label-text="Number of sets"
    />
    <InputField
      v-model:inputContent="recordData.reps"
      input-type="number"
      input-id="reps"
      :vuelidate-errors="v$.reps.$errors"
      label-text="Number of repetitions"
    />
    <p class="mb-5">{{ props.workoutId }}</p>
    <ListView
      :collection="exercisesCollection"
      :filtered-collection="filteredCollection"
      :item-id="props.workoutId"
      @on-selected-item="addExerciseToWorkout"
    />
  </div>
</template>
