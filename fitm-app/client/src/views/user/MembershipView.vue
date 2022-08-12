<script setup>
import { onErrorCaptured, ref } from "vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import MyMembership from "@/components/ui/client-components/MyMembership.vue";
const err = ref(null);
onErrorCaptured((e) => {
  err.value = e;
  return true;
});
</script>

<template>
  <main>
    <div v-if="err">
      <MultiStepSkeleton />
    </div>
    <Suspense>
      <template #default>
        <MyMembership />
      </template>
      <template #fallback>
        <MultiStepSkeleton />
      </template>
    </Suspense>
  </main>
</template>
