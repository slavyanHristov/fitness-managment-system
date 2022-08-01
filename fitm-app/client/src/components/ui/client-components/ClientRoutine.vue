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
      <h1>Routine here</h1>
      <div class="flex gap-6 mb-5">
        {{ routine.name }}
        <span>{{ routine.fitness_instructor.user.name }}</span>
      </div>
      <div v-for="workout in routine.workouts" :key="workout.id" class="mb-6">
        <div class="flex gap-4">
          <p>{{ workout.name }}</p>
          <p>{{ workout.day_of_week.name }}</p>
          <p>{{ workout.workout_type.name }}</p>
        </div>
        <div
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
        </div>
      </div>
    </div>
  </div>
</template>
