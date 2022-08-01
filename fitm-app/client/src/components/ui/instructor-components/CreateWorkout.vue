<script setup>
import { ref, computed } from "vue";
import InputField from "@/components/ui/InputField.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import MainButton from "@/components/ui/MainButton.vue";
import InstructorService from "@/services/API-calls/InstructorService";
import ComboBox from "@/components/ui/ComboBox.vue";

const emit = defineEmits(["closeModal", "refreshItems"]);
const props = defineProps(["routineId"]);

const dayOfWeek = ref([
  {
    id: 1,
    name: "Monday",
  },
  {
    id: 2,
    name: "Tuesday",
  },
  {
    id: 3,
    name: "Wednesday",
  },
  {
    id: 4,
    name: "Thursday",
  },
  {
    id: 5,
    name: "Friday",
  },
]);
const workoutType = ref([
  {
    id: 1,
    name: "Yoga",
  },
  {
    id: 2,
    name: "Stretching",
  },
  {
    id: 3,
    name: "Aerobic",
  },
  {
    id: 4,
    name: "Anaerobic",
  },
]);
const workout = ref({
  name: "",
  workoutTypeId: null,
  dayOfWeekId: null,
  routineId: props.routineId,
  //routineId,
  //TODO: dayOfWeekId => COMBOBOX
  //TODO: workoutTypeId => COMBOBOX
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
    workoutTypeId: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
    dayOfWeekId: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
  };
});

const v$ = useVuelidate(rules, workout);

const createWorkout = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const response = await InstructorService.createWorkout(workout.value);
      emit("refreshItems");
      setTimeout(() => emit("closeModal"), 1500);
      console.log(response);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form class="bg-inherit" @submit.prevent="createWorkout">
      <InputField
        v-model:inputContent="workout.name"
        input-type="text"
        input-id="name"
        :vuelidate-errors="v$.name.$errors"
        label-text="Workout Name"
      />
      <ComboBox
        v-model:selectedItem="workout.workoutTypeId"
        combo-box-name="workoutType"
        label-text="Workout Type"
        :collection="workoutType"
        :vuelidate-errors="v$.workoutTypeId.$errors"
      />
      <ComboBox
        v-model:selectedItem="workout.dayOfWeekId"
        combo-box-name="dayOfWeek"
        label-text="Day of the week"
        :collection="dayOfWeek"
        :vuelidate-errors="v$.dayOfWeekId.$errors"
      />
      <MainButton button-text="Create" />
    </form>
  </div>
</template>
