<script setup>
import { ref, computed } from "vue";
import InputField from "./InputField.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import MainButton from "./MainButton.vue";
import InstuctorService from "@/services/API-calls/InstructorService";

const emit = defineEmits(["closeModal", "refreshItems"]);
const routine = ref({
  name: "",
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
  };
});

const v$ = useVuelidate(rules, routine);

const createRoutine = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const response = await InstuctorService.createRoutine(routine.value);
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
    <form class="bg-inherit" @submit.prevent="createRoutine">
      <InputField
        v-model:inputContent="routine.name"
        input-type="text"
        input-id="name"
        :vuelidate-errors="v$.name.$errors"
        label-text="Routine Name"
      />
      <MainButton button-text="Create" />
    </form>
  </div>
</template>
