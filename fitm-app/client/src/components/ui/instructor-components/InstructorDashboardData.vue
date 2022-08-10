<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import InstructorService from "@/services/API-calls/InstructorService.js";
import TableView from "@/components/ui/TableView.vue";
import InfoBlock from "@/components/ui/InfoBlock.vue";
import ProfileBlock from "@/components/ui/ProfileBlock.vue";

const router = useRouter();
const dashboardData = ref(null);
const clientsCollection = ref(null);
const clientCount = ref(null);
const profileData = ref(null);

const headerCollection = ref(["Level", "Weight", "Name"]);

const getDashboardData = async () => {
  try {
    const response = await InstructorService.getDashboardData();
    dashboardData.value = response.data;
    clientsCollection.value = dashboardData.value.collection;
    clientCount.value = clientsCollection.value.length;
    profileData.value = dashboardData.value.userData;
  } catch (err) {
    console.log(err);
  }
};
await getDashboardData();
</script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="flex flex-col items-center justify-center min-w-full min-h-full gap-16"
    >
      <div class="flex items-center justify-center w-10/12">
        <div
          class="grid w-full grid-cols-1 gap-8 mt-10 place-items-center md:mt-0 md:gap-20 lg:grid-cols-3"
        >
          <ProfileBlock :user-data="profileData" />
          <InfoBlock
            :info="clientCount"
            title="Clients"
            color-top="to-primaryPink"
            color-bottom="from-accentBlue"
          >
            <template #icon>
              <img
                class="w-16 h-16"
                src="@/assets/icons/dashboard-icons/user.svg"
                alt=""
              />
            </template>
          </InfoBlock>
          <div
            id="buttons"
            class="flex flex-col items-center justify-center min-w-full gap-4"
          >
            <button
              class="min-w-[80%] py-1 font-bold rounded-full transition-colors bg-primaryBlue hover:bg-accentBlue text-primaryDark"
              @click="router.push({ name: 'yourClients' })"
            >
              Manage Clients
            </button>
            <button
              class="min-w-[80%] py-1 font-bold rounded-full transition-colors bg-primaryPink hover:bg-accentPink text-primaryDark"
              @click="router.push({ name: 'createRoutine' })"
            >
              Create Fitness Routine
            </button>
            <button
              class="min-w-[80%] py-1 font-bold rounded-full transition-colors bg-primaryGreen hover:bg-accentGreen text-primaryDark"
              @click="router.push({ name: 'gymsView' })"
            >
              Gyms
            </button>
          </div>
        </div>
      </div>
      <div class="w-full px-10 py-6">
        <h1 class="mb-5 font-bold uppercase">Your Latest Clients:</h1>
        <TableView
          :collection="clientsCollection"
          :header-collection="headerCollection"
        />
      </div>
    </div>
  </div>
</template>
