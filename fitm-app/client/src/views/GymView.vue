<script setup>
// import FullAccessService from "@/services/API-calls/FullAccessService";
import GymInfo from "@/components/ui/GymInfo.vue";
import GymInfoSkeleton from "@/components/skeleton-loaders/GymInfoSkeleton.vue";
// import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// const router = useRouter();

const gymId = route.params.id;

// const gym = ref(null);
// const getGym = async () => {
//   try {
//     const res = await FullAccessAPI.getGym(gymId);
//     gym.value = res.data.foundGym;
//     console.log(gym.value);
//   } catch (err) {
//     console.log(err);
//     router.push({ name: "notFound" });
//   }
// };

// onMounted(async () => {
//   await getGym();
// });
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
