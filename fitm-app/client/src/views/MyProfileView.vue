<script setup>
import ProfileInfo from "@/components/ui/ProfileInfo.vue";
import ProfileInfoSkeleton from "@/components/skeleton-loaders/ProfileInfoSkeleton.vue";
</script>

<template>
  <div class="w-full">
    <Suspense>
      <template #default>
        <ProfileInfo />
      </template>
      <template #fallback>
        <ProfileInfoSkeleton />
      </template>
    </Suspense>
  </div>
</template>
