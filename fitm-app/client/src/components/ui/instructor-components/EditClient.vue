<script setup>
import { ref, onMounted, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import InstructorService from "@/services/API-calls/InstructorService";
import MainButton from "@/components/ui/MainButton.vue";
import ComboBox from "../ComboBox.vue";
import parsePayload from "@/utils/parsePayload";

const props = defineProps(["itemData"]);
const emit = defineEmits(["refreshData"]);
const foundItemData = ref(props.itemData);
const clientId = foundItemData.value.id;
const routines = ref(null);
//TODO: EMIT REFRESH
const fitnessLevels = ref([
  {
    id: 1,
    name: "Beginner",
  },
  {
    id: 2,
    name: "Novice",
  },
  {
    id: 3,
    name: "Intermediate",
  },
  {
    id: 4,
    name: "Advanced",
  },
]);

const setFitnessLevel = (fitnessLevelName) => {
  return fitnessLevels.value.find(
    (fitnessLevel) => fitnessLevel.name === fitnessLevelName
  ).id;
};

const clientFields = ref({
  fitnessLevelId: {
    label: "Select Fitness Level",
    comboBox: {
      name: "fitnessLevel",
      collection: fitnessLevels.value,
    },
    value: setFitnessLevel(foundItemData.value.fitness_level),
  },
  routineId: {
    label: "Set Workout Routine",
    comboBox: {
      name: "routine",
      collection: routines,
    },
    value: foundItemData.value.routineId,
  },
});

const rules = computed(() => {
  return {
    fitnessLevelId: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    routineId: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
  };
});

const v$ = useVuelidate(rules, clientFields);

const getYourRoutines = async () => {
  try {
    const response = await InstructorService.getYourRoutines();
    routines.value = response.data.collection;
    console.log(routines.value);
  } catch (err) {
    console.log(err);
  }
};
const editAction = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const response = await InstructorService.editClient(
        clientId,
        parsePayload(clientFields.value)
      );
      emit("refreshData");
      console.log(response);
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getYourRoutines();
  console.log(foundItemData.value.routineId);
});
</script>
<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form class="w-96 bg-inherit" @submit.prevent="editAction">
      <div
        v-for="(field, index) in clientFields"
        :key="index"
        class="bg-inherit"
      >
        <ComboBox
          v-model:selectedItem="field.value"
          :combo-box-name="field.comboBox.name"
          :label-text="field.label"
          :collection="field.comboBox.collection"
          :vuelidate-errors="v$[index].$errors"
        />
      </div>
      <MainButton class="mt-10" button-text="Submit" />
    </form>
  </div>
</template>
