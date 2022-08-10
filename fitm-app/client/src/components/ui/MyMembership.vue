<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import Spinner from "@/components/ui/Spinner.vue";
import ClientService from "@/services/API-calls/ClientService";
import MainButton from "./MainButton.vue";
import parseISODate from "@/utils/parseISODate";
import MultiStepSkeleton from "../skeleton-loaders/MultiStepSkeleton.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
const authStore = useAuthStore();
// let membershipId = authStore.getCurrentUser.userRole.membership
const foundMembership = ref(null);
const router = useRouter();
const loading = ref(false);
const toastMsg = ref("");
let redirectTimer = null;

const payload = ref({
  name: "Fit-M Membership",
  fee: null, //null,
  membershipTypeId: null, //null,
  gymId: null, // null,
});

const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const getMembership = async () => {
  try {
    const response = await ClientService.getMembership();
    foundMembership.value = response.data.membership;
    payload.value.fee = foundMembership.value.fee;
    payload.value.membershipTypeId = foundMembership.value.membershipTypeId;
    payload.value.gymId = foundMembership.value.gymId;
    const picked = (({ status, clientId }) => ({ status, clientId }))(
      foundMembership.value
    );
    // console.log(picked);
    authStore.setMembership(picked);
  } catch (err) {
    showToastAndRedirect(err.response.data.message, "clientDashboard");
    console.log(err);
  }
};
// const membershipStatus = authStore.getCurrentUser?.userRole?.membership;
// console.log(authStore.getCurrentUser?.userRole?.membership);

await getMembership();

const renewMembership = async () => {
  try {
    loading.value = true;
    const payResponse = await ClientService.payMembership(payload.value);
    if (payResponse.status === 200) {
      loading.value = false;
      console.log(payResponse);
      window.location = payResponse.data.forwardLink;
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});
</script>

<template>
  <main>
    <Toast :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <ErrorIcon />
      </template>
    </Toast>
    <div v-if="!foundMembership">
      <MultiStepSkeleton />
    </div>
    <div v-else class="relative flex items-center justify-center min-h-screen">
      <Spinner :is-active="loading" />
      <div
        id="membership"
        class="flex flex-col items-center justify-center border border-solid rounded-lg border-primaryBlue bg-primaryBgWhite dark:bg-accentDark h-fit w-fit"
      >
        <header
          class="w-full py-6 mb-6 text-center border-b border-primaryBlue"
        >
          <h1 class="font-bold uppercase font-poppins">My Membership</h1>
        </header>
        <main class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div class="px-3 text-center">
            <span>Gym: </span>
            <span class="italic font-bold font-poppins">{{
              foundMembership.gym.name
            }}</span>
          </div>
          <div class="px-3 text-center">
            <span>Status: </span>
            <span
              :class="
                foundMembership.status === 'expired'
                  ? 'text-red-500'
                  : 'text-green-500'
              "
              class="italic font-bold font-poppins"
              >{{ foundMembership.status }}</span
            >
          </div>

          <div class="px-3 text-center">
            <span>Start Date: </span>
            <span class="italic font-bold font-poppins">{{
              parseISODate(foundMembership.start_date)
            }}</span>
          </div>
          <div class="px-3 text-center">
            <span>End Date: </span>
            <span class="italic font-bold font-poppins">{{
              parseISODate(foundMembership.end_date)
            }}</span>
          </div>
          <div class="px-3 text-center">
            <span>Membership Type: </span>
            <span class="italic font-bold font-poppins">{{
              foundMembership.membership_type.name
            }}</span>
          </div>
          <div class="px-3 text-center">
            <span>Membership Fee: </span>
            <span class="italic font-bold font-poppins"
              >{{ foundMembership.fee }}$</span
            >
          </div>
        </main>
        <footer class="py-6">
          <MainButton
            v-if="foundMembership.status === 'expired'"
            button-text="Renew Membership"
            @click="renewMembership"
          />
        </footer>
      </div>
    </div>
  </main>
</template>
