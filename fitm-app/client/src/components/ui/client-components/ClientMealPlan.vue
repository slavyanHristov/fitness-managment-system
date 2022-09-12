<script setup>
import { ref, computed, onUnmounted } from "vue";
import ClientService from "@/services/API-calls/ClientService";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import { useRouter } from "vue-router";
import MealPlanDayContainer from "@/components/ui/client-components/MealPlanDayContainer.vue";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon.vue";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon.vue";

const router = useRouter();
const mealPlan = ref(null);
const toastMsg = ref("");
const noMealPlan = ref(false);
const eatingDays = ref(null);
const clientCalories = ref(null);

let redirectPage = "";
let redirectTimer = null;

const currentDay = ref(0);

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
    clientCalories.value = mealPlan.value.calories;
    console.log(mealPlan.value);
  } catch (err) {
    noMealPlan.value = true;
    console.log(err);
    if (err.response && err.response.data) {
      if (err.response.status === 403) redirectPage = "clientMembership";
      if (
        err.response.status === 404 &&
        err.response.data.message.startsWith("Not found")
      )
        redirectPage = "gymsView";
      else if (err.response.status === 404) redirectPage = "clientDashboard";
      showToastAndRedirect(err.response.data.message, redirectPage);
    }
  }
};

await getMealPlan();

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});

const numOfEatingDays = computed(() => {
  return eatingDays.value.length;
});
const isLastDay = computed(() => {
  return currentDay.value === numOfEatingDays.value - 1;
});
const isFirstDay = computed(() => {
  return currentDay.value === 0;
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
    return (
      prev +
      curr.food.reduce((prev, curr) => {
        return prev + curr.total_calories;
      }, 0)
    );
  }, 0);
};

const calcRemainingCalories = (goal, consumed) => {
  return (goal - consumed).toFixed(2);
};

const total = computed(() => {
  return reduced;
});
</script>

<template>
  <div class="w-full">
    <Toast class="top-[55px]" :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <ErrorIcon />
      </template>
    </Toast>
    <MultiStepSkeleton v-if="noMealPlan" />
    <div v-else class="w-full">
      <h1 class="my-2 font-bold tracking-wider text-center uppercase">
        {{ mealPlan.meal_plan.name }}
      </h1>

      <transition-group
        class="grid w-full h-full grid-cols-1"
        name="slide"
        tag="div"
      >
        <div
          v-for="(eating_day, index) in eatingDays"
          v-show="currentDay === index"
          :key="index"
          class="w-full col-start-1 row-start-1"
        >
          <div class="flex flex-col items-center justify-center">
            <div
              id="day-container"
              class="flex items-center justify-center gap-20 p-2 rounded-lg bg-accentWhite dark:bg-testColor"
            >
              <ArrowLeftIcon class="cursor-pointer" @click="prevDay" />
              <p class="px-6 font-bold uppercase">
                {{ eating_day.day_of_week.name }}
              </p>
              <ArrowRightIcon class="cursor-pointer" @click="nextDay" />
            </div>
            <div
              id="calories-container"
              class="flex flex-col justify-center gap-1 p-2 my-5 border border-solid rounded-lg border-primaryBgWhite dark:border-accentGray bg-accentWhite dark:bg-testColor"
            >
              <div><h3 class="dark:text-darkerWhite">Calories</h3></div>
              <div class="flex">
                <div class="text-center">
                  <p class="font-bold uppercase">{{ clientCalories }}</p>
                  <p class="dark:text-darkerWhite">Goal</p>
                </div>
                <div class="px-6">-</div>
                <div class="text-center">
                  <p class="font-bold uppercase">
                    {{ total(eating_day.meals) }}
                  </p>
                  <p class="dark:text-darkerWhite">Consumed</p>
                </div>
                <div class="px-6">=</div>
                <div class="text-center">
                  <p class="font-bold uppercase">
                    {{
                      calcRemainingCalories(
                        clientCalories,
                        total(eating_day.meals)
                      )
                    }}
                  </p>
                  <p class="dark:text-darkerWhite">Remaining</p>
                </div>
              </div>
            </div>
            <div
              v-for="meal in eating_day.meals"
              :key="meal.id"
              class="flex items-center justify-center w-full"
            >
              <MealPlanDayContainer
                class="w-11/12"
                :item="meal"
                @refresh-items="getMealPlan"
              />
            </div>
          </div>
        </div>
      </transition-group>
    </div>
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
