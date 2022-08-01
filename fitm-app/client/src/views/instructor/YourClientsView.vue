<script setup>
import { ref, onErrorCaptured } from "vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";
import YourClients from "@/components/ui/instructor-components/YourClients.vue";
const err = ref(null);
onErrorCaptured((e) => {
  err.value = e;
  return true;
});
</script>
<template>
  <div>
    <div v-if="err">
      <AllGymsSkeleton />
    </div>
    <Suspense>
      <template #default> <YourClients /> </template>
      <template #fallback> <AllGymsSkeleton /> </template>
    </Suspense>
  </div>
</template>
