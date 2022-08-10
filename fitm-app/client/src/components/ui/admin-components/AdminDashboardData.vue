<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AdminService from "@/services/API-calls/AdminService";
import TableView from "@/components/ui/TableView.vue";
import InfoBlock from "@/components/ui/InfoBlock.vue";
const dashboardData = ref(null);
const gymsCount = ref(null);
const collection = ref([]);

const router = useRouter();
const headerCollection = ref(["Name", "Position", "Gym"]);
const getDashboardData = async () => {
  try {
    const response = await AdminService.getDashboardData();
    dashboardData.value = response.data;
    gymsCount.value = dashboardData.value.count;
    collection.value = dashboardData.value.collection;
  } catch (err) {
    console.log(err);
  }
};

await getDashboardData();
</script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="flex flex-col items-center justify-center min-w-full min-h-full gap-20"
    >
      <div class="flex items-center justify-center w-10/12">
        <div
          class="grid grid-cols-1 gap-3 mt-10 md:mt-0 md:gap-20 lg:grid-cols-2"
        >
          <InfoBlock
            :info="gymsCount"
            title="Gyms"
            color-top="to-primaryBlue"
            color-bottom="from-primaryYellow"
          >
            <template #icon>
              <img
                class="w-16 h-16"
                src="@/assets/icons/dashboard-icons/gym.svg"
                alt=""
              />
            </template>
          </InfoBlock>
          <InfoBlock
            :info="collection.length"
            title="Employees"
            color-top="to-accentBlue"
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
        </div>
      </div>
      <div class="w-full px-10 py-6">
        <h1 class="mb-5 font-bold uppercase">Newest Employees:</h1>
        <div
          class="flex flex-col items-center justify-center w-full gap-6 md:gap-0 md:flex-row"
        >
          <div id="table-container" class="w-full md:min-w-[70%]">
            <TableView
              :collection="collection"
              :header-collection="headerCollection"
            />
          </div>
          <div
            id="buttons"
            class="min-w-full md:min-w-[30%] flex flex-col gap-4 justify-center items-center"
          >
            <button
              class="min-w-[60%] py-1 font-bold rounded-full transition-colors bg-primaryBlue hover:bg-accentBlue text-primaryDark"
              @click="router.push({ name: 'registerManager' })"
            >
              Register Manager
            </button>
            <button
              class="min-w-[60%] py-1 font-bold rounded-full transition-colors bg-primaryPink hover:bg-accentPink text-primaryDark"
              @click="router.push({ name: 'addGym' })"
            >
              Add Gym
            </button>
            <button
              class="min-w-[60%] py-1 font-bold rounded-full transition-colors bg-primaryGreen hover:bg-accentGreen text-primaryDark"
              @click="router.push({ name: 'gymsView' })"
            >
              Gyms
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
