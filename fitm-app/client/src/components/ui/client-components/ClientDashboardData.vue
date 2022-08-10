<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import ClientService from "@/services/API-calls/ClientService.js";
import InfoBlock from "@/components/ui/InfoBlock.vue";
import ProfileBlock from "@/components/ui/ProfileBlock.vue";
const router = useRouter();

const dashboardData = ref(null);
const userData = ref(null);
const calories = ref(null);
const membershipStatus = ref("none");
const colorTop = ref("");
const colorBottom = ref("");
const getDashboardData = async () => {
  try {
    const response = await ClientService.getDashboardData();
    dashboardData.value = response.data;
    userData.value = dashboardData.value.userData;
    calories.value = dashboardData.value.clientData.calories;
    if (dashboardData.value.membershipStatus !== null)
      membershipStatus.value = dashboardData.value.membershipStatus.status;
    setColors();
    console.log(colorTop.value, colorBottom.value, membershipStatus.value);
  } catch (err) {
    console.log(err);
  }
};
const setColors = () => {
  if (
    membershipStatus.value === "none" ||
    membershipStatus.value == "expired"
  ) {
    colorTop.value = "to-primaryYellow";
    colorBottom.value = "from-primaryYellow";
    return;
  } else {
    colorTop.value = "to-primaryGreen";
    colorBottom.value = "from-accentGreen";
  }
};

await getDashboardData();
</script>
<template>
  <div class="flex items-center justify-center min-h-screen select-none">
    <div
      class="flex flex-col items-center justify-center min-w-full min-h-full gap-16"
    >
      <div class="flex items-center justify-center w-10/12 h-1/2">
        <div
          class="grid w-full grid-cols-1 gap-6 mt-10 place-items-center md:mt-0 md:gap-20 lg:grid-cols-2"
        >
          <div
            class="relative flex items-center justify-center w-full cursor-pointer bg-primaryDark group rounded-xl h-60"
            @click="router.push({ name: 'clientMealPlan' })"
          >
            <img
              class="absolute object-cover w-full h-full transition-opacity opacity-80 rounded-xl group-hover:opacity-40"
              src="@/assets/images/meal-plan.jpg"
              alt=""
            />
            <h1
              class="text-5xl font-bold uppercase text-primaryWhite drop-shadow-solidMd"
            >
              Meal Plan
            </h1>
          </div>
          <div
            class="relative flex items-center justify-center w-full cursor-pointer bg-primaryDark group rounded-xl h-60"
            @click="router.push({ name: 'clientRoutine' })"
          >
            <img
              class="absolute object-cover w-full h-full transition-opacity rounded-xl group-hover:opacity-60"
              src="@/assets/images/routine.jpg"
              alt=""
            />
            <h1
              class="text-5xl font-bold uppercase text-primaryWhite drop-shadow-solidMd"
            >
              Routine
            </h1>
          </div>
        </div>
      </div>
      <div class="w-full px-12 py-6">
        <div
          class="grid w-full grid-cols-1 gap-6 lg:gap-10 lg:grid-cols-3 place-items-center"
        >
          <ProfileBlock :user-data="userData" />
          <InfoBlock
            :info="calories"
            title="Calories"
            color-top="to-primaryPink"
            color-bottom="from-accentBlue"
          >
            <template #icon>
              <img
                class="w-16 h-16"
                src="@/assets/icons/dashboard-icons/calories.svg"
                alt=""
              />
            </template>
          </InfoBlock>
          <InfoBlock
            class="cursor-pointer"
            :info="membershipStatus"
            title="Membership Status"
            :color-top="colorTop"
            :color-bottom="colorBottom"
            @click="router.push({ name: 'clientMembership' })"
          >
            <template #icon>
              <img
                class="w-16 h-16"
                src="@/assets/icons/dashboard-icons/membership.svg"
                alt=""
              />
            </template>
          </InfoBlock>
        </div>
      </div>
    </div>
  </div>
</template>
