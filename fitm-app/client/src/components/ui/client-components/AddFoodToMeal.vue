<script setup>
import { ref, onMounted, computed } from "vue";
import ClientService from "@/services/API-calls/ClientService";
import SearchFilter from "../SearchFilter.vue";
import ListView from "../ListView.vue";
import { filterBySingle } from "@/utils/filtrationsAndSorts";

const props = defineProps(["mealId"]);
const emit = defineEmits(["closeModal", "refreshItems"]);
const foodsCollection = ref(null);
const search = ref("");

const recordData = ref({
  foodId: null,
  mealId: props.mealId,
});

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
    recordData.value.foodId = foodId;

    const response = await ClientService.addFoodToMeal(recordData.value);
    console.log(response);
    //emit refreshItems
    emit("refreshItems");
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getAllFoods();
});
</script>
<template>
  <div>
    <h1>Add Food</h1>
    <SearchFilter
      v-model:inputValue="search"
      placeholder-val="Search foods..."
    />
    <div v-if="foodsCollection">
      <ListView
        :collection="foodsCollection"
        :filtered-collection="filteredCollection"
        :item-id="props.mealId"
        @on-selected-item="addFoodToMeal"
      />
    </div>
  </div>
</template>
