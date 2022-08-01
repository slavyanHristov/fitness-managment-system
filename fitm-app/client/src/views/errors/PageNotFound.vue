<script setup>
import { useRouter } from "vue-router";
import SkewedButton from "@/components/ui/SkewedButton.vue";

const router = useRouter();

const redirectHome = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen md:justify-around md:flex-row"
  >
    <img src="@/assets/images/not-found.svg" class="w-1/2" alt="" />
    <div class="flex flex-col items-center justify-center gap-6 mt-8 md:mt-0">
      <h1
        class="text-3xl text-center uppercase font-poppins lg:text-4xl xl:text-5xl"
      >
        Page not found
      </h1>
      <SkewedButton
        class="mt-8 bg-primaryBlue hover:bg-transparent hover:skewedButton-outline"
        button-text="Back To Home"
        @click="redirectHome"
      />
    </div>
  </div>
</template>
