<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ManagerService from "@/services/API-calls/ManagerService";

import GridContainer from "@/components/ui/GridContainer.vue";
import RangeFilter from "@/components/ui/RangeFilter.vue";
import SearchFilter from "@/components/ui/SearchFilter.vue";
import SortCollection from "@/components/ui/SortCollection.vue";
import EmployeeCard from "@/components/ui/manager-components/EmployeeCard.vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import CoverImage from "@/components/ui/CoverImage.vue";

import {
  filterByRangeAndSearch,
  sortByNumberAsc,
  sortByNumberDesc,
} from "@/utils/filtrationsAndSorts";

const router = useRouter();
const employeesCollection = ref(null);
const toastMsg = ref("");

let search = ref("");
let rangeSliderVal = ref(5000);
let redirectTimer = null;
const coverImg = ref("../src/assets/images/employees-cover.jpg");

const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const getYourEmployees = async () => {
  try {
    const res = await ManagerService.getYourEmployees();
    employeesCollection.value = res.data.collection;
    console.log(employeesCollection.value);
  } catch (err) {
    showToastAndRedirect(
      "No employees found. You'll be redirected.",
      "managerDashboard"
    );
    // router.push({ name: "managerDashboard" });
    console.log(err);
  }
};
await getYourEmployees();

const sortByCollection = ref([
  {
    id: 1,
    name: "Salary High To Low",
    column: "salary",
    action: sortByNumberDesc,
  },
  {
    id: 2,
    name: "Salary Low To High",
    column: "salary",
    action: sortByNumberAsc,
  },
]);

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});

//Filter by all properties in a array of objects
let filteredEmployees = computed(() => {
  return filterByRangeAndSearch(
    employeesCollection.value,
    "salary",
    rangeSliderVal.value,
    search.value
  );
});
</script>
<template>
  <div>
    <Toast :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <ErrorIcon />
      </template>
    </Toast>
    <div v-if="employeesCollection" class="w-full">
      <CoverImage>
        <template #header>
          <header
            class="flex flex-col justify-end w-full bg-[left_calc(0%)_top_calc(30%)] bg-no-repeat bg-cover h-64"
            :style="{
              'background-image':
                'linear-gradient(rgba(27, 154, 252, 0.600), rgba(37, 205, 247, 0.600)) ,url(' +
                coverImg +
                ')',
            }"
          >
            <h1
              class="ml-8 text-5xl font-bold text-white uppercase drop-shadow-solidSm"
            >
              Your Employees
            </h1>
          </header>
        </template>
      </CoverImage>
      <div
        class="grid grid-cols-1 gap-3 auto-rows-fr place-items-center p-2.5 m-5 rounded-lg lg:grid-cols-3 bg-primaryBgWhite dark:bg-accentDark"
      >
        <RangeFilter
          v-model:sliderValue="rangeSliderVal"
          title="Salary"
          min-val="500"
          max-val="5000"
        />
        <SearchFilter
          v-model:inputValue="search"
          placeholder-val="Search employees..."
        />
        <SortCollection
          :sort-collection="sortByCollection"
          :collection="employeesCollection"
        />
      </div>
      <GridContainer
        :collection="employeesCollection"
        :filtered-collection="filteredEmployees"
        grid-card-type="personType"
      >
        <template #card="slotProps">
          <EmployeeCard
            :item="slotProps.item"
            @refresh-employees="getYourEmployees"
          />
        </template>
      </GridContainer>
    </div>
    <div v-else>
      <AllGymsSkeleton />
    </div>
  </div>
</template>
