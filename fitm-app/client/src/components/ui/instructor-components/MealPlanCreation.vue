<script setup>
import { ref, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import InstructorService from "@/services/API-calls/InstructorService";
import MainButton from "@/components/ui/MainButton.vue";
import InputField from "@/components/ui/InputField.vue";

const props = defineProps(["itemData"]);
const emit = defineEmits(["refreshData", "closeModal"]);
const foundItemData = ref(props.itemData);
const clientId = foundItemData.value.id;

const mealPlanData = ref({
  clientId: clientId,
  name: "",
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
  };
});

const v$ = useVuelidate(rules, mealPlanData);

const createAndSetMealPlan = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const response = await InstructorService.createMealPlan(
        mealPlanData.value
      );
      emit("refreshData");
      emit("closeModal");
      console.log(response);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form class="bg-inherit" @submit.prevent="createAndSetMealPlan">
      <InputField
        v-model:inputContent="mealPlanData.name"
        input-type="text"
        input-id="name"
        :vuelidate-errors="v$.name.$errors"
        label-text="Meal Plan Name"
      />
      <MainButton button-text="Submit" />
    </form>
  </div>
</template>
