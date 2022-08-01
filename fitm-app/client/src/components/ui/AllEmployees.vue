<script setup>
import { ref, computed } from "vue";

import ManagerService from "@/services/API-calls/ManagerService";

import GridContainer from "./GridContainer.vue";
import RangeFilter from "./RangeFilter.vue";
import SearchFilter from "./SearchFilter.vue";
import SortCollection from "./SortCollection.vue";
import EmployeeCard from "./EmployeeCard.vue";

import {
  filterByRangeAndSearch,
  sortByNumberAsc,
  sortByNumberDesc,
} from "@/utils/filtrationsAndSorts";
import CoverImage from "./CoverImage.vue";

const employeesCollection = ref(null);
let search = ref("");
let rangeSliderVal = ref(5000);

const coverImg = ref("../src/assets/images/gyms-cover2.jpg");

const getYourEmployees = async () => {
  try {
    const res = await ManagerService.getYourEmployees();
    employeesCollection.value = res.data.collection;
    console.log(employeesCollection.value);
  } catch (err) {
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
  <div class="w-full">
    <CoverImage :img-path="coverImg" title-text="Your Employees" />
    <div
      class="grid grid-cols-1 gap-3 auto-rows-fr place-items-center p-2.5 m-5 rounded-lg lg:grid-cols-3 bg-accentDark"
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
</template>
