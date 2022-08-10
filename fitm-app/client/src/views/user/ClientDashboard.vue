<script setup>
import { ref, onErrorCaptured } from "vue";
import ClientDashboardData from "@/components/ui/client-components/ClientDashboardData.vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";

const err = ref(null);
onErrorCaptured((e) => {
  err.value = e;
  return true;
});
</script>

<template>
  <div>
    <div v-if="err">
      <MultiStepSkeleton />
    </div>
    <Suspense>
      <template #default>
        <ClientDashboardData />
      </template>
      <template #fallback>
        <MultiStepSkeleton />
      </template>
    </Suspense>
  </div>
</template>
