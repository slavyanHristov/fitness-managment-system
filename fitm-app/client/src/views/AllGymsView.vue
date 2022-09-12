<script setup>
import AllGyms from "@/components/ui/AllGyms.vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";
</script>

<template>
  <div class="w-full">
    <Suspense>
      <template #default>
        <AllGyms />
      </template>
      <template #fallback>
        <AllGymsSkeleton />
      </template>
    </Suspense>
  </div>
</template>
