<script setup>
import { ref, onMounted, computed } from "vue";
import ClientService from "@/services/API-calls/ClientService";
import SearchFilter from "../SearchFilter.vue";
import InputField from "@/components/ui/InputField.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, between } from "@vuelidate/validators";
import { validatePrecision } from "@/utils/customValidators";
import ListView from "../ListView.vue";
import { filterBySingle } from "@/utils/filtrationsAndSorts";

const props = defineProps(["mealId"]);
const emit = defineEmits(["closeModal", "refreshItems"]);
const foodsCollection = ref(null);
const search = ref("");

const headerCollection = ref([
  "Food",
  "Calories",
  "Protein",
  "Carbs",
  "Fats",
  "Type",
]);

const recordData = ref({
  quantity: 1,
  foodId: null,
  mealId: props.mealId,
});

const rules = computed(() => {
  return {
    quantity: {
      required: helpers.withMessage("Field cannot be empty", required),
      between: helpers.withMessage(
        "Value must be between (0.1-20)",
        between(0.1, 20)
      ),
      validatePrecision: helpers.withMessage(
        "Invalid number",
        validatePrecision
      ),
    },
  };
});

const v$ = useVuelidate(rules, recordData);

const getAllFoods = async () => {
  try {
    const response = await ClientService.getAllFoods();
    foodsCollection.value = response.data.collection;
    console.log(foodsCollection.value);
  } catch (err) {
    console.log(err);
  }
};
const filteredCollection = computed(() => {
  return filterBySingle(foodsCollection.value, search.value, "name");
});

const addFoodToMeal = async (foodId) => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      recordData.value.foodId = foodId;
      const response = await ClientService.addFoodToMeal(recordData.value);
      console.log(response);
      emit("refreshItems");
      emit("closeModal");
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getAllFoods();
});
</script>
<template>
  <div class="">
    <SearchFilter
      v-model:inputValue="search"
      placeholder-val="Search foods..."
    />
    <div
      v-if="foodsCollection"
      class="flex flex-col items-center justify-center mt-4 bg-primaryBgWhite dark:bg-accentDark"
    >
      <InputField
        v-model:inputContent="recordData.quantity"
        class="w-1/3"
        input-type="number"
        input-id="quantity"
        :vuelidate-errors="v$.quantity.$errors"
        label-text="Food Quantity"
      />
      <ListView
        :collection="foodsCollection"
        :filtered-collection="filteredCollection"
        :item-id="props.mealId"
        :header-collection="headerCollection"
        @on-selected-item="addFoodToMeal"
      />
    </div>
  </div>
</template>
