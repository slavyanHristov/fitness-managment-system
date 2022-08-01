<script setup>
import { ref, computed } from "vue";
import FullAccessService from "@/services/API-calls/FullAccessService";
import ClientService from "@/services/API-calls/ClientService";
import { useAuthStore } from "@/stores/authStore";
// import RangeFilter from "./RangeFilter.vue";
import SearchFilter from "./SearchFilter.vue";
// import SortCollection from "./SortCollection.vue";
import GridContainer from "./GridContainer.vue";
import InstructorCard from "./InstructorCard.vue";
import {
  filterBySingle,
  // sortByNumberAsc,
  // sortByNumberDesc,
} from "@/utils/filtrationsAndSorts";
import CoverImage from "./CoverImage.vue";

const authStore = useAuthStore();
const instructorsCollection = ref(null);

let search = ref("");
// let rangeSliderVal = ref(100);
const coverImg = ref("src/assets/images/gyms-cover2.jpg");

const getAllInstructors = async () => {
  try {
    const res = await FullAccessService.getAllInstructors();
    instructorsCollection.value = res.data.collection;
  } catch (err) {
    console.log(err);
  }
};
const getInstructorsInGym = async () => {
  try {
    const res = await ClientService.getInstructorsInGym();
    instructorsCollection.value = res.data.collection;
  } catch (err) {
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
    <CoverImage :img-path="coverImg" title-text="Fit/m Instructors" />
    <div
      class="grid grid-cols-1 gap-3 auto-rows-fr place-items-center p-2.5 m-5 rounded-lg lg:grid-cols-3 bg-accentDark"
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
</template>
