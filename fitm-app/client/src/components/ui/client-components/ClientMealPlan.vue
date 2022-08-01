<script setup>
import { ref, inject, computed } from "vue";
import ClientService from "@/services/API-calls/ClientService";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import Modal from "@/components/ui/Modal.vue";
import AddFoodToMeal from "@/components/ui/client-components/AddFoodToMeal.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const apiUrlPath = inject("apiUrlPath");
const mealPlan = ref(null);
const mealId = ref(null);
const toastMsg = ref("");
const eatingDays = ref(null);
const isModalOpen = ref(false);

let redirectPage = "";
let redirectTimer = null;

const currentDay = ref(1);

const addFood = (id) => {
  console.log("added " + id);
  mealId.value = id;
  isModalOpen.value = true;
};

const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const getMealPlan = async () => {
  try {
    const response = await ClientService.getYourMealPlan();
    mealPlan.value = response.data.mealPlan;
    eatingDays.value = mealPlan.value.meal_plan.eating_days;

    console.log(mealPlan.value);
  } catch (err) {
    console.log(err);
    // router.push({ name: "notFound" });
  }
};

await getMealPlan();

const numOfEatingDays = computed(() => {
  return eatingDays.value.length;
});
const isLastDay = computed(() => {
  return currentDay.value === numOfEatingDays.value;
});
const isFirstDay = computed(() => {
  return currentDay.value === 1;
});

const nextDay = () => {
  if (isLastDay.value) {
    return;
  }
  currentDay.value++;
};
const prevDay = () => {
  if (isFirstDay.value) {
    return;
  }
  currentDay.value--;
};

const reduced = (coll) => {
  return coll.reduce((prev, curr) => {
    console.log(prev);
    console.log(curr.food);
    return (
      prev +
      curr.food.reduce((prev, curr) => {
        return prev + curr.calories;
      }, 0)
    );
  }, 0);
};
// const totalCalories = computed(() => {
//   return eatingDays.value.reduce((prevVal, currentVal) => {
//     return prevVal + currentVal;
//   }, 0);
// });

const total = computed(() => {
  return reduced;
});
</script>

<template>
  <div class="relative h-screen">
    <Modal
      :open="isModalOpen"
      header-title="Add Exercise To Workout"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <AddFoodToMeal :meal-id="mealId" @refresh-items="getMealPlan" />
      <!-- <CreateWorkout
          :routine-id="routineId"
          @close-modal="isModalOpen = !isModalOpen"
          @refresh-items="getExercisesInWorkout"
        /> -->
    </Modal>
    <h1>{{ mealPlan.meal_plan.name }}</h1>
    <button @click="prevDay">Prev</button>
    <button @click="nextDay">Next</button>
    <transition-group class="" name="slide" tag="div">
      <div
        v-for="eating_day in eatingDays"
        v-show="currentDay === eating_day.id"
        :key="eating_day"
        class="absolute"
      >
        <div class="mb-5 ml-5">
          <div>
            {{ eating_day.day_of_week.name }}
            <!-- PUT ME HERE -->
            {{ total(eating_day.eatingDay_has_meals) }}
            <div
              v-for="eatingDay_has_meal in eating_day.eatingDay_has_meals"
              :key="eatingDay_has_meal.id"
              class="ml-10"
            >
              <div>{{ eatingDay_has_meal.meal.name }}</div>
              <div
                v-for="food in eatingDay_has_meal.food"
                :key="food.id"
                class="ml-16"
              >
                <p>{{ food.name }}</p>
              </div>
              <button @click="addFood(eatingDay_has_meal.id)">Add Food</button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slidedown-enter-active,
.slidedown-leave-active {
  transition-property: opacity;
  transition-duration: 1s;
  opacity: 1;
}
.slidedown-enter-from,
.slidedown-leave-to {
  opacity: 0;
}
</style>
