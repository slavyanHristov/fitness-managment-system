<script setup>
import { onErrorCaptured, ref } from "vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import RegisterInstructor from "@/components/ui/RegisterInstructor.vue";
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
        <RegisterInstructor />
      </template>
      <template #fallback>
        <MultiStepSkeleton />
      </template>
    </Suspense>
  </main>
</template>
