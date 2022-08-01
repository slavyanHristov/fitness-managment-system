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
    class="h-full overflow-hidden rounded shadow-lg bg-testColor w-80"
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
        <h3>{{ props.item.name }}</h3>
        <p>{{ props.item.monthly_cost }}</p>
      </div>
      <div id="footer">
        <button @click="redirectToGym(props.item.id)">Details</button>
      </div>
    </div>
  </div>
</template>
