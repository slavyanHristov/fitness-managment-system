<script setup>
import { ref, onUnmounted, inject } from "vue";
import ClientService from "@/services/API-calls/ClientService";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const apiUrlPath = inject("apiUrlPath");
const routine = ref(null);
const toastMsg = ref("");
const noRoutine = ref(false);
let redirectPage = "";
let redirectTimer = null;

const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const getYourRoutine = async () => {
  try {
    const response = await ClientService.getYourRoutine();
    routine.value = response.data.routine;
    console.log(routine.value);
  } catch (err) {
    console.log(err);
    noRoutine.value = true;
    if (err.response && err.response.data) {
      console.log(err);
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

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});

await getYourRoutine();
</script>

<template>
  <div>
    <Toast class="top-[55px]" :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <ErrorIcon />
      </template>
    </Toast>
    <MultiStepSkeleton v-if="noRoutine" />
    <div v-else>
      <div class="flex items-center justify-center gap-6 my-5">
        <h1 class="font-bold uppercase">{{ routine.name }}</h1>
        <h1 class="font-bold uppercase">
          BY {{ routine.fitness_instructor.user.name }}
        </h1>
      </div>
      <div class="flex flex-col items-center justify-center">
        <div
          v-for="workout in routine.workouts"
          :key="workout.id"
          class="w-10/12 mb-6"
        >
          <div
            class="flex w-full gap-4 px-6 py-2 rounded-t-lg bg-gradient-to-t from-primaryBlue to-accentBlue"
          >
            <h1 class="text-xl font-bold tracking-wider uppercase lg:text-3xl">
              {{ workout.name }}
            </h1>
            <h1 class="text-xl font-bold tracking-wider uppercase lg:text-3xl">
              {{ workout.day_of_week.name }}
            </h1>
            <h1 class="text-xl font-bold tracking-wider uppercase lg:text-3xl">
              {{ workout.workout_type.name }}
            </h1>
          </div>
          <table class="w-full overflow-hidden border-collapse">
            <thead>
              <tr
                class="font-bold text-center bg-primaryWhite dark:bg-accentDark"
              >
                <td class="px-4 py-1"></td>
                <td class="px-4 py-1"><p class="text-sm">Exercise Name</p></td>
                <td class="px-4 py-1"><p class="text-sm">Muscle Group</p></td>
                <td class="px-4 py-1"><p class="text-sm">Exercise Type</p></td>
                <td class="px-4 py-1"><p class="text-sm">Sets</p></td>
                <td class="px-4 py-1"><p class="text-sm">Reps</p></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="exercise in workout.exercises"
                :key="exercise.id"
                class="text-center bg-accentWhite dark:bg-testColor"
              >
                <td class="px-4 py-2">
                  <img
                    class="min-w-14 min-h-14 h-14 w-14"
                    :src="apiUrlPath + exercise.image.path"
                    alt="Exercise Image"
                  />
                </td>
                <td class="px-4 py-2">
                  <p class="text-sm">{{ exercise.name }}</p>
                </td>
                <td class="px-4 py-2">
                  <p class="text-sm">{{ exercise.muscle_group.name }}</p>
                </td>
                <td class="px-4 py-2">
                  <p class="text-sm">{{ exercise.exercise_type.name }}</p>
                </td>
                <td class="px-4 py-2">
                  <p class="text-sm">
                    {{ exercise.exercise_has_workout.sets }}
                  </p>
                </td>
                <td class="px-4 py-2">
                  <p class="text-sm">
                    {{ exercise.exercise_has_workout.reps }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <div
          v-for="exercise in workout.exercises"
          :key="exercise.id"
          class="flex items-center gap-4"
        >
          <img
            class="w-14 h-14"
            :src="apiUrlPath + exercise.image.path"
            alt="Exercise Image"
          />
          <p>{{ exercise.name }}</p>
          <p>{{ exercise.muscle_group.name }}</p>
          <p>{{ exercise.exercise_type.name }}</p>
          <p>{{ exercise.exercise_has_workout.sets }}</p>
          <p>{{ exercise.exercise_has_workout.reps }}</p>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
