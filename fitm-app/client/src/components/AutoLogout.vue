<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

import Toast from "@/components/ui/Toast.vue";
const authStore = useAuthStore();

const events = ["mousemove", "mousedown", "scroll", "keypress", "load"];

let warningTimer = null;
let isWarningReached = ref(null);
let logoutTimer = null;

const resetTimer = () => {
  // on event detected reset the timer for warning and auto-logout
  clearTimeout(warningTimer);
  clearTimeout(logoutTimer);
  setTimers();
};
const warningMessage = () => {
  isWarningReached.value = true;
};
const setTimers = () => {
  warningTimer = setTimeout(warningMessage, 14 * 60 * 1000); // 14min => 14 * 60 * 1000
  logoutTimer = setTimeout(async () => {
    await authStore.logout();
  }, 15 * 60 * 1000); // 15min => 15 * 60 * 1000

  isWarningReached.value = false;
};

onMounted(() => {
  events.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });
  setTimers(); // on first page load set timers
});

onUnmounted(() => {
  // when the auto-login component is unloaded from the app
  // remove all event listeners and clear all current timeouts
  events.forEach((event) => {
    window.removeEventListener(event, resetTimer);
  });
  clearTimeout(warningTimer);
  clearTimeout(logoutTimer);
});
</script>

<template>
  <!--TODO: Migrate this to Toast -->
  <!-- <div v-if="isWarningReached">Are you still with us?</div> -->
  <Toast :isToastActive="isWarningReached" toastMsg="Are you still with us?" />
</template>
