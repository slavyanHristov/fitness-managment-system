<script setup>
import { ref, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRoute, useRouter } from "vue-router";
import FullAccessService from "@/services/API-calls/FullAccessService";
import ClientService from "@/services/API-calls/ClientService";
import MembershipCard from "./MembershipCard.vue";
import Spinner from "./Spinner.vue";
import Toast from "./Toast.vue";
import ErrorIcon from "../icons/ErrorIcon.vue";

const toastMsg = ref("");
// const toastType = ref(null);
const route = useRoute();
const router = useRouter();
const foundGym = ref(null);
const loading = ref(false);
const authStore = useAuthStore();
let redirectTimer = null;
// const myfee = ref(null);
const { id } = route.params;
const getGymData = async () => {
  try {
    const response = await FullAccessService.getGym(id);
    foundGym.value = response.data.foundGym;
    console.log(foundGym.value);
  } catch (err) {
    router.push({ name: "notFound" });
    console.log(err);
  }
};
await getGymData();

const memberships = ref([
  {
    id: 1,
    fee: (foundGym.value.monthly_cost * 0.1).toFixed(2),
    description: "Daily Visit",
    color: "#25F792",
  },
  {
    id: 2,
    fee: foundGym.value.monthly_cost,
    description: "Monthly Fee",
    color: "#FDFF90",
  },
  {
    id: 3,
    fee: foundGym.value.monthly_cost * 11,
    description: "Yearly fee",
    color: "#1B9CFC",
  },
]);
const membershipData = ref({
  gymId: id,
  clientId: null,
  membershipTypeId: null,
  name: null,
  fee: null,
});

// const gymPaymentData = ref({
//   fee: foundGym.value.monthly_cost,
//   name: foundGym.value.name,
// });
const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const createMembership = async (membershipType, fee) => {
  try {
    membershipData.value.membershipTypeId = membershipType;
    membershipData.value.fee = fee;
    membershipData.value.clientId = authStore.getCurrentUser.userRole;
    console.log(fee);
    console.log(membershipType);
    membershipData.value.name = "Fit-M Membership";
    console.log("MEMBERSHIP", membershipData.value);
    loading.value = true;
    const payResponse = await ClientService.payMembership(membershipData.value);
    // const response = await ClientService.createMembership(membershipData.value);
    if (payResponse.status === 200) {
      loading.value = false;
      console.log(payResponse);
      window.location = payResponse.data.forwardLink;
    }
    // console.log(response);
  } catch (err) {
    loading.value = false;
    showToastAndRedirect(err.response.data.message, "home");
    console.log(err);
  }
};
onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});
// onMounted(async () => {
//   console.log(id);
// });
</script>
<template>
  <div
    v-if="foundGym"
    class="relative flex items-center justify-center min-h-screen gap-24"
  >
    <Toast class="top-[55px]" :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <ErrorIcon />
      </template>
    </Toast>
    <Spinner :is-active="loading" />
    <div class="grid w-full grid-cols-1 md:grid-cols-3 place-items-center">
      <MembershipCard
        v-for="membership in memberships"
        :key="membership.id"
        :cost="membership.fee"
        :title="'Tier ' + membership.id"
        :description="membership.description"
        :color="membership.color"
        @on-button-click="createMembership(membership.id, membership.fee)"
      />
    </div>
    <!-- <div>
      <h1>Daily</h1>
      {{ foundGym.monthly_cost * 0.1 }}
      <button @click="createMembership(1, foundGym.monthly_cost * 0.1)">
        Buy Now
      </button>
    </div>
    <div>
      <h1>Monthly</h1>
      {{ foundGym.monthly_cost }}
      <button @click="createMembership(2, foundGym.monthly_cost)">
        Buy Now
      </button>
    </div>
    <div>
      <h1>Yearly</h1>
      {{ foundGym.monthly_cost * 11 }}
      <button @click="createMembership(3, foundGym.monthly_cost * 11)">
        Buy Now
      </button>
    </div> -->
  </div>
</template>
