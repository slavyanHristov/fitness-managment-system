<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
const props = defineProps(["item"]);
const router = useRouter();

const apiUrlPath = inject("apiUrlPath");

const redirectToGym = (id) => {
  router.push({ path: "/gyms/" + id });
};
</script>

<template>
  <div
    id="container"
    class="h-full overflow-hidden rounded shadow-lg bg-primaryWhite dark:bg-testColor w-80"
  >
    <div id="inner">
      <div id="header" class="">
        <img
          class="object-cover w-full max-h-48"
          :src="apiUrlPath + props.item.images[0].path"
          alt="gym image"
        />
      </div>
      <div id="content">
        <h3 class="italic font-bold text-center uppercase">
          {{ props.item.name }}
        </h3>
        <div
          class="flex items-center justify-center gap-2 p-2 bg-accentWhite dark:bg-accentTestColor"
        >
          <p>Montly Cost:</p>
          <p class="text-lg italic text-center">
            {{ props.item.monthly_cost }}
          </p>
        </div>
      </div>
      <div id="footer" class="bg-accentWhite dark:bg-accentTestColor">
        <button
          class="w-full my-1.5 transition-colors tracking-widest font-bold rounded-full bg-primaryBlue hover:bg-accentBlue"
          @click="redirectToGym(props.item.id)"
        >
          Details
        </button>
      </div>
    </div>
  </div>
</template>
