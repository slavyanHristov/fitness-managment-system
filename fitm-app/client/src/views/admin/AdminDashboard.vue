<script setup>
import { onErrorCaptured, ref } from "vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import AdminDashboardData from "@/components/ui/admin-components/AdminDashboardData.vue";
const err = ref(null);

onErrorCaptured((e) => {
  err.value = e;
  return true;
});
</script>

<template>
  <div>
    <div v-if="err"></div>
    <Suspense>
      <template #default>
        <AdminDashboardData />
      </template>
      <template #fallback> <MultiStepSkeleton /> </template>
    </Suspense>
  </div>
</template>
