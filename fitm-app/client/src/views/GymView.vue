<script setup>
import GymInfo from "@/components/ui/GymInfo.vue";
import GymInfoSkeleton from "@/components/skeleton-loaders/GymInfoSkeleton.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const gymId = route.params.id;
</script>

<template>
  <div>
    <div id="gym info" class=""></div>
    <Suspense>
      <template #default>
        <GymInfo :gym-id="gymId" />
      </template>
      <template #fallback>
        <GymInfoSkeleton />
      </template>
    </Suspense>
  </div>
</template>
