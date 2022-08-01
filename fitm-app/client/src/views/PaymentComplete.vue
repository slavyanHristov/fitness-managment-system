<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import SkewedButton from "@/components/ui/SkewedButton.vue";
import ClientService from "@/services/API-calls/ClientService";
import { useAuthStore } from "@/stores/authStore";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// let membershipData = null;

// const setMembership = async () => {
//   try {
//     const response = await ClientService.getMembership(
//       route.query.membershipId
//     );
//     console.log(response);
//     membershipData = response.data.membership;
//     console.log(membershipData);
//     authStore.setMembership(membershipData);
//   } catch (err) {
//     console.log(err);
//   }
// };
onMounted(async () => {
  console.log("asd");
  setTimeout(async () => {
    await authStore.logout();
  }, 2000);
});

const redirectHome = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen md:justify-around md:flex-row"
  >
    <img src="@/assets/images/success-page.svg" class="w-1/2" alt="" />
    <div class="flex flex-col items-center justify-center gap-6 mt-8 md:mt-0">
      <h1
        class="text-3xl text-center uppercase font-poppins lg:text-4xl xl:text-5xl"
      >
        Payment Complete!
      </h1>
      <h3>Please re-login to finalize your membership!</h3>
      <SkewedButton
        class="mt-8 bg-primaryGreen hover:bg-transparent hover:skewedButton-outline"
        button-text="Back To Home"
        @click="redirectHome"
      />
    </div>
  </div>
</template>
