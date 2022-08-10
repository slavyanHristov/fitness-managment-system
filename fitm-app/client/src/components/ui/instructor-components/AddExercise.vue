<script setup>
import { ref, onMounted, computed } from "vue";
import InstructorService from "@/services/API-calls/InstructorService";
import useVuelidate from "@vuelidate/core";
import { required, helpers, between, integer } from "@vuelidate/validators";

import SearchFilter from "../SearchFilter.vue";
import InputField from "../InputField.vue";
import ListView from "../ListView.vue";
import { filterByMultiple } from "@/utils/filtrationsAndSorts";

const props = defineProps(["workoutId"]);
const emit = defineEmits(["closeModal", "refreshItems"]);
const exercisesCollection = ref(null);
const search = ref("");

const headerCollection = ref(["Exercise", "Muscle"]);

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
      between: helpers.withMessage(
        "Value must be betweeen (1,20)",
        between(1, 20)
      ),
      integer: helpers.withMessage("Must be an integer!", integer),
    },
    reps: {
      required: helpers.withMessage("Field cannot be empty", required),
      between: helpers.withMessage(
        "Value must be between (1,30)",
        between(1, 30)
      ),
      integer: helpers.withMessage("Must be an integer!", integer),
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
      emit("closeModal");
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
  <div v-if="exercisesCollection" class="bg-primaryBgWhite dark:bg-accentDark">
    <SearchFilter
      v-model:inputValue="search"
      placeholder-val="Search exercises..."
    />
    <div class="flex items-center justify-center gap-2 bg-inherit">
      <InputField
        v-model:inputContent="recordData.sets"
        input-type="number"
        input-id="sets"
        :vuelidate-errors="v$.sets.$errors"
        label-text="Sets"
      />
      <InputField
        v-model:inputContent="recordData.reps"
        input-type="number"
        input-id="reps"
        :vuelidate-errors="v$.reps.$errors"
        label-text="Repetitions"
      />
    </div>
    <ListView
      :collection="exercisesCollection"
      :filtered-collection="filteredCollection"
      :item-id="props.workoutId"
      :header-collection="headerCollection"
      @on-selected-item="addExerciseToWorkout"
    />
  </div>
</template>
