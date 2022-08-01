<script setup>
import { ref } from "vue";
import AllGyms from "@/components/ui/AllGyms.vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";
import TemplateView from "@/components/ui/TemplateView.vue";

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
    column: "monthly_cost",
    action: sortByNumberDesc,
  },
  {
    id: 2,
    name: "Salary Low To High",
    column: "monthly_cost",
    action: sortByNumberAsc,
  },
]);

const getAllGyms = async () => {
  try {
    return await FullAccessService.getAllGyms();
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
          :async-action="getAllGyms"
          :filter-callback="filterByRangeAndSearch"
          column-name="monthly_cost"
          grid-type="gymType"
          :sort-collection="sortByCollection"
        /> -->
        <AllGyms />
      </template>
      <template #fallback>
        <AllGymsSkeleton />
      </template>
    </Suspense>
  </div>
</template>
