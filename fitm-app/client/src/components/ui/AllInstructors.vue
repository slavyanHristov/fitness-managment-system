<script setup>
import { ref, computed } from "vue";
import FullAccessService from "@/services/API-calls/FullAccessService";
import ClientService from "@/services/API-calls/ClientService";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

// import RangeFilter from "./RangeFilter.vue";
import SearchFilter from "./SearchFilter.vue";
// import SortCollection from "./SortCollection.vue";
import GridContainer from "./GridContainer.vue";
import InstructorCard from "./InstructorCard.vue";
import AllGymsSkeleton from "../skeleton-loaders/AllGymsSkeleton.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";

import {
  filterBySingle,
  // sortByNumberAsc,
  // sortByNumberDesc,
} from "@/utils/filtrationsAndSorts";
import CoverImage from "./CoverImage.vue";

const router = useRouter();
const authStore = useAuthStore();
const instructorsCollection = ref(null);

const toastMsg = ref("");
const search = ref("");
let redirectTimer = null;

// let rangeSliderVal = ref(100);
const coverImg = ref("src/assets/images/instructors-cover.jpg");

const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const getAllInstructors = async () => {
  try {
    const res = await FullAccessService.getAllInstructors();
    instructorsCollection.value = res.data.collection;
  } catch (err) {
    showToastAndRedirect("No instructors found. You'll be redirected.", "home");
    console.log(err);
  }
};
const getInstructorsInGym = async () => {
  try {
    const res = await ClientService.getInstructorsInGym();
    instructorsCollection.value = res.data.collection;
  } catch (err) {
    showToastAndRedirect(
      "No instructors found. You'll be redirected.",
      "clientDashboard"
    );
    console.log(err);
  }
};
if (authStore.isCurrentUserClient) {
  await getInstructorsInGym();
} else {
  await getAllInstructors();
}

// const sortByCollection = ref([
//   {
//     id: 1,
//     name: "Monthly Cost High To Low",
//     column: "monthly_cost",
//     action: sortByNumberDesc,
//   },
//   {
//     id: 2,
//     name: "Monthly Cost Low To High",
//     column: "monthly_cost",
//     action: sortByNumberAsc,
//   },
//   {
//     id: 3,
//     name: "Size High To Low",
//     column: "size",
//     action: sortByNumberDesc,
//   },
//   {
//     id: 4,
//     name: "Size Low To High",
//     column: "size",
//     action: sortByNumberAsc,
//   },
// ]);

//Filter by all properties in a array of objects
let filteredInstructors = computed(() => {
  return filterBySingle(instructorsCollection.value, search.value, "name");
});
</script>

<template>
  <div class="w-full">
    <Toast :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <ErrorIcon />
      </template>
    </Toast>
    <div v-if="instructorsCollection">
      <CoverImage>
        <template #header>
          <header
            class="flex flex-col justify-end w-full bg-[left_calc(0%)_top_calc(30%)] bg-no-repeat bg-cover h-64"
            :style="{ 'background-image': 'url(' + coverImg + ')' }"
          >
            <h1
              class="mr-8 text-5xl font-bold text-right text-white uppercase drop-shadow-solidSm"
            >
              Fit/m Instructors
            </h1>
          </header>
        </template>
      </CoverImage>
      <div
        class="grid grid-cols-1 gap-3 auto-rows-fr place-items-center p-2.5 m-5 rounded-lg lg:grid-cols-3 bg-primaryBgWhite dark:bg-accentDark"
      >
        <!-- <RangeFilter
        v-model:sliderValue="rangeSliderVal"
        title="Monthly Cost"
        min-val="30"
        max-val="100"
      /> -->
        <SearchFilter
          v-model:inputValue="search"
          placeholder-val="Search instructors..."
        />
        <!-- <SortCollection
        :sort-collection="sortByCollection"
        :collection="instructorsCollection"
      /> -->
      </div>
      <GridContainer
        :collection="instructorsCollection"
        grid-card-type="instructorType"
        :filtered-collection="filteredInstructors"
      >
        <template #card="slotProps">
          <InstructorCard :item="slotProps.item" />
        </template>
      </GridContainer>
    </div>
    <div v-else>
      <AllGymsSkeleton />
    </div>
  </div>
</template>
