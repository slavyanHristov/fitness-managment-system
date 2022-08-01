<script setup>
import { ref, onMounted } from "vue";
import InstructorService from "@/services/API-calls/InstructorService";
const mealPlan = ref(null);

const getMealPlan = async () => {
  try {
    const response = await InstructorService.testingFind();
    mealPlan.value = response.data.collection;
    console.log(mealPlan.value);
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getMealPlan();
});
</script>
<template>
  <div>
    <div v-if="mealPlan">
      <div v-for="day in mealPlan" :key="day.id" class="pl-5 mb-5">
        <div>{{ day.day_of_week.name }}</div>
        <div v-for="mealFood in day.meal_has_foods" :key="mealFood.id">
          <div>{{ mealFood.meal.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
