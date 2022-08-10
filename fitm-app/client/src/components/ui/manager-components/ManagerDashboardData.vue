<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";

import ManagerService from "@/services/API-calls/ManagerService.js";
import InfoBlock from "@/components/ui/InfoBlock.vue";
import ProfileBlock from "@/components/ui/ProfileBlock.vue";
import TableView from "@/components/ui/TableView.vue";
import Modal from "@/components/ui/Modal.vue";
import NotFoundResource from "@/components/ui/NotFoundResource.vue";
const apiUrlPath = inject("apiUrlPath");

const router = useRouter();
const isModalOpen = ref(false);
const dashboardData = ref(null);
const userData = ref(null);
const employeeCount = ref(null);
const membershipCount = ref(null);
const gymImage = ref(null);
const myGyms = ref([]);
const memberships = ref([]);
const headerCollection = ref(["Gym Fee", "Gym", "Client"]);
const getDashboardData = async () => {
  try {
    const response = await ManagerService.getDashboardData();
    dashboardData.value = response.data;
    userData.value = dashboardData.value.userData;
    employeeCount.value = dashboardData.value.employeeCount;
    membershipCount.value = dashboardData.value.membershipCount;
    if (dashboardData.value.gymImage !== null)
      gymImage.value = dashboardData.value.gymImage.path;
    myGyms.value = dashboardData.value.myGyms;
    memberships.value = dashboardData.value.memberships;
  } catch (err) {
    console.log(err);
  }
};

const displayImg = () => {
  if (gymImage.value !== null) {
    return apiUrlPath + gymImage.value;
  }
  return "../src/assets/images/clients-cover.jpg";
};

await getDashboardData();
</script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <Modal
      :open="isModalOpen"
      header-title="Gyms you manage"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <div>
        <div v-for="gym in myGyms" :key="gym.id">
          <p class="text-center">{{ gym.name }}</p>
        </div>
        <NotFoundResource v-if="myGyms.length === 0" title="No Gyms" />
      </div>
    </Modal>
    <div
      class="flex flex-col items-center justify-center min-w-full min-h-full gap-16"
    >
      <div class="flex items-center justify-center w-10/12">
        <div
          class="grid w-full grid-cols-1 gap-6 mt-10 place-items-center md:mt-0 md:gap-20 lg:grid-cols-3"
        >
          <ProfileBlock :user-data="userData" />
          <InfoBlock
            :info="employeeCount"
            title="Your Employees"
            color-top="to-primaryYellow"
            color-bottom="from-accentGreen"
          >
            <template #icon>
              <img
                class="w-16 h-16"
                src="@/assets/icons/dashboard-icons/employee.svg"
                alt=""
              />
            </template>
          </InfoBlock>
          <InfoBlock
            :info="membershipCount"
            title="Gym Memberships"
            color-top="to-accentBlue"
            color-bottom="from-primaryYellow"
          >
            <template #icon>
              <img
                class="w-16 h-16"
                src="@/assets/icons/dashboard-icons/user.svg"
                alt=""
              />
            </template>
          </InfoBlock>
        </div>
      </div>
      <div class="w-full px-12 py-6">
        <h1 class="mb-5 font-bold uppercase lg:mb-0">Latest Memberships:</h1>
        <div
          class="flex flex-col items-center justify-center w-full gap-6 md:gap-12 md:flex-row"
        >
          <div id="table-container" class="w-full md:min-w-[50%]">
            <TableView
              :collection="memberships"
              :header-collection="headerCollection"
            />
          </div>
          <div
            id="dashboard-navigation"
            :style="{ 'background-image': 'url(' + displayImg() + ')' }"
            class="flex flex-col items-center self-stretch justify-center w-full gap-5 px-10 py-6 rounded-lg cursor-pointer"
            @click.self="isModalOpen = true"
          >
            <h1
              class="text-4xl font-bold text-primaryWhite drop-shadow-solidMd"
              @click.self="isModalOpen = true"
            >
              Your Gyms
            </h1>
            <div
              id="buttons"
              class="flex flex-col items-center justify-center gap-2 text-primaryWhite"
            >
              <button
                class="text-lg font-bold transition-all hover:-translate-y-1 drop-shadow-solidSm"
                @click="router.push({ name: 'employeesView' })"
              >
                Your Employees
              </button>
              <button
                class="text-lg font-bold transition-all hover:-translate-y-1 drop-shadow-solidSm"
                @click="router.push({ name: 'registerInstructor' })"
              >
                Register Instructor
              </button>
              <button
                class="text-lg font-bold transition-all hover:-translate-y-1 drop-shadow-solidSm"
                @click="router.push({ name: 'registerEmployee' })"
              >
                Register Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#dashboard-navigation {
  background-position: center;
  background-size: cover;
}
</style>
