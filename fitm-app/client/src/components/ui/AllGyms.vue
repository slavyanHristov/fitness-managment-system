<script setup>
import { ref, computed } from "vue";
import FullAccessService from "@/services/API-calls/FullAccessService";
import RangeFilter from "./RangeFilter.vue";
import SearchFilter from "./SearchFilter.vue";
import SortCollection from "./SortCollection.vue";
import GridContainer from "./GridContainer.vue";
import {
  filterByRangeAndSearch,
  sortByNumberAsc,
  sortByNumberDesc,
} from "@/utils/filtrationsAndSorts";
import CoverImage from "./CoverImage.vue";
import GymCard from "./GymCard.vue";

const gymsCollection = ref(null);
let search = ref("");
let rangeSliderVal = ref(100);
const coverImg = ref("src/assets/images/gyms-cover2.jpg");

const getAllGyms = async () => {
  try {
    const res = await FullAccessService.getAllGyms();
    gymsCollection.value = res.data.collection;
  } catch (err) {
    console.log(err);
  }
};

await getAllGyms();

const sortByCollection = ref([
  {
    id: 1,
    name: "Monthly Cost High To Low",
    column: "monthly_cost",
    action: sortByNumberDesc,
  },
  {
    id: 2,
    name: "Monthly Cost Low To High",
    column: "monthly_cost",
    action: sortByNumberAsc,
  },
  {
    id: 3,
    name: "Size High To Low",
    column: "size",
    action: sortByNumberDesc,
  },
  {
    id: 4,
    name: "Size Low To High",
    column: "size",
    action: sortByNumberAsc,
  },
]);

//Filter by all properties in a array of objects
let filteredGyms = computed(() => {
  return filterByRangeAndSearch(
    gymsCollection.value,
    "monthly_cost",
    rangeSliderVal.value,
    search.value
  );
});
</script>

<template>
  <div class="w-full">
    <CoverImage>
      <template #header>
        <header
          class="flex flex-col justify-end w-full bg-[left_calc(0%)_top_calc(40%)] bg-no-repeat bg-cover h-64"
          :style="{ 'background-image': 'url(' + coverImg + ')' }"
        >
          <h1
            class="ml-8 text-5xl font-bold text-white uppercase drop-shadow-solidSm"
          >
            Fit/m Gyms
          </h1>
        </header>
      </template>
    </CoverImage>
    <div
      class="grid grid-cols-1 gap-3 auto-rows-fr place-items-center p-2.5 m-5 rounded-lg lg:grid-cols-3 bg-primaryBgWhite dark:bg-accentDark"
    >
      <RangeFilter
        v-model:sliderValue="rangeSliderVal"
        title="Monthly Cost"
        min-val="30"
        max-val="100"
      />
      <SearchFilter
        v-model:inputValue="search"
        placeholder-val="Search gyms..."
      />
      <SortCollection
        :sort-collection="sortByCollection"
        :collection="gymsCollection"
      />
    </div>
    <GridContainer
      :collection="gymsCollection"
      grid-card-type="gymType"
      :filtered-collection="filteredGyms"
    >
      <template #card="slotProps">
        <GymCard :item="slotProps.item" />
      </template>
    </GridContainer>
  </div>
</template>
