<script setup>
import { useRouter } from "vue-router";
import parseISODate from "@/utils/parseISODate";
const router = useRouter();

const props = defineProps(["item"]);

const redirect = () => {
  router.push("/instructor/routine/" + props.item.id);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center p-3">
    <h1 class="font-bold font-poppins">{{ props.item.name }}</h1>
    <div class="flex gap-6 py-3">
      <span class="uppercase font-inter">Created: </span>
      <p class="uppercase font-inter">
        {{ parseISODate(props.item.createdAt) }}
      </p>
    </div>
    <button @click="redirect">View/Edit</button>
  </div>
</template>
