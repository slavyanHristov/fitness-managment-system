<script setup>
import { ref } from "vue";
import AnimatedNumber from "@/components/ui/AnimatedNumber.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import GymIcon from "@/components/icons/GymIcon.vue";
import RoutineIcon from "@/components/icons/RoutineIcon.vue";
import FullAccessService from "@/services/API-calls/FullAccessService.js";
import Waves from "@/components/icons/Waves.vue";

const routinesCount = ref(0);
const gymsCount = ref(0);
const instructorsCount = ref(0);

const getDataCount = async () => {
  try {
    const response = await FullAccessService.getDataCount();
    routinesCount.value = response.data.routinesCount;
    gymsCount.value = response.data.gymsCount;
    instructorsCount.value = response.data.instructorsCount;
  } catch (err) {
    console.log(err);
  }
};

await getDataCount();
</script>
<template>
  <div class="relative w-full h-full">
    <Waves />
    <div
      class="relative flex items-center justify-center w-10/12 h-full mx-auto py-36"
    >
      <div class="z-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div
          class="flex flex-col items-center justify-center gap-5 p-10 rounded-lg bg-accentWhite dark:bg-testColor"
        >
          <RoutineIcon class="w-20 h-20" />
          <AnimatedNumber :number="routinesCount" />
          <h1>Routines</h1>
        </div>
        <div
          class="flex flex-col items-center justify-center gap-5 p-10 rounded-lg bg-accentWhite dark:bg-testColor"
        >
          <GymIcon class="w-20 h-20" />
          <AnimatedNumber :number="gymsCount" />
          <h1>Gyms</h1>
        </div>
        <div
          class="flex flex-col items-center justify-center gap-5 p-10 rounded-lg bg-accentWhite dark:bg-testColor"
        >
          <UserIcon class="w-20 h-20" />
          <AnimatedNumber :number="instructorsCount" />
          <h1>Instructors</h1>
        </div>
      </div>
    </div>
  </div>
</template>
