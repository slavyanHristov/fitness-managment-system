<script setup>
import { ref, computed } from "vue";
import RangeFilter from "./RangeFilter.vue";
import SearchFilter from "./SearchFilter.vue";
import SortCollection from "./SortCollection.vue";
import GridContainer from "./GridContainer.vue";
import CoverImage from "./CoverImage.vue";
const props = defineProps([
  "asyncAction",
  "sortCollection",
  "filterCallback",
  "columnName",
  "gridType",
]);
let search = ref("");
let rangeSliderVal = ref(5000);
const coverImg = ref("src/assets/images/gyms-cover2.jpg");

const response = ref(await props.asyncAction());
const collection = ref(response.value.data.collection);

let filteredCollection = computed(() => {
  return props.filterCallback(
    collection.value,
    props.columnName,
    rangeSliderVal.value,
    search.value
  );
});
</script>

<template>
  <div v-if="collection" class="w-full">
    <CoverImage :img-path="coverImg" title-text="Fit/m Instructors" />
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
        placeholder-val="Search gyms..."
      />
      <SortCollection
        :sort-collection="props.sortCollection"
        :collection="collection"
      />
    </div>
    <GridContainer
      :collection="collection"
      :grid-card-type="props.gridType"
      :filtered-collection="filteredCollection"
    />
  </div>
</template>
