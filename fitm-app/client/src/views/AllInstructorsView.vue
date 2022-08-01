<script setup>
import { ref } from "vue";
import TemplateView from "@/components/ui/TemplateView.vue";
import AllInstructors from "@/components/ui/AllInstructors.vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";
import FullAccessService from "@/services/API-calls/FullAccessService";
import {
  sortByNumberAsc,
  sortByNumberDesc,
  filterByRangeAndSearch,
} from "@/utils/filtrationsAndSorts";
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

const getAllInstructors = async () => {
  try {
    return await FullAccessService.getAllInstructors();
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div class="w-full">
    <Suspense>
      <template #default>
        <!-- <TemplateView
          :async-action="getAllInstructors"
          :filter-callback="filterByRangeAndSearch"
          column-name="salary"
          grid-type="personType"
          :sort-collection="sortByCollection"
        /> -->
        <AllInstructors />
      </template>
      <template #fallback>
        <AllGymsSkeleton />
      </template>
    </Suspense>
  </div>
</template>
