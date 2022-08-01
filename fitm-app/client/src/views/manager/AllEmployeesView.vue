<script setup>
import AllEmployees from "@/components/ui/AllEmployees.vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";
</script>

<template>
  <div class="w-full">
    <Suspense>
      <template #default>
        <AllEmployees />
      </template>
      <template #fallback>
        <AllGymsSkeleton />
      </template>
    </Suspense>
  </div>
</template>
