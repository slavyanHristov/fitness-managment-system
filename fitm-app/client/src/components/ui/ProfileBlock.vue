<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(["userData"]);
const apiUrlPath = inject("apiUrlPath");
const router = useRouter();
</script>
<template>
  <div
    v-if="props.userData"
    class="flex items-center justify-center w-full h-full gap-5 rounded-xl bg-darkerWhite dark:bg-accentDark"
  >
    <div class="flex items-center justify-center">
      <img
        class="rounded-full w-28 h-28"
        :src="apiUrlPath + props.userData.image.path"
        alt="UserImage"
      />
    </div>
    <div class="flex flex-col items-center justify-between gap-7">
      <h2>{{ props.userData.name }}</h2>
      <button
        class="w-full py-1 font-bold transition-colors rounded-full bg-primaryGreen hover:bg-accentGreen text-primaryDark"
        @click="router.push({ name: 'myProfile' })"
      >
        Profile
      </button>
    </div>
  </div>
</template>
