<script setup>
import { useRouter } from "vue-router";
import SkewedButton from "@/components/ui/SkewedButton.vue";

const router = useRouter();
</script>

<template>
  <div id="wrapper">
    <section
      id="firstSection"
      class="flex justify-center h-screen max-w-screen-xl px-4 py-8 mx-auto lg:h-auto lg:grid lg:gap-8 xl:gap-0 lg:pt-8 lg:pb-0 lg:grid-cols-12"
    >
      <div
        id="left"
        class="flex flex-col items-center justify-center lg:block place-self-center lg:col-span-7"
      >
        <h1
          class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-wide text-center uppercase lg:text-left md:text-5xl xl:text-6xl dark:text-white"
        >
          Start your adventure now
        </h1>
        <p
          class="text-2xl tracking-wider text-center text-gray-300 uppercase lg:text-left mb-14 opacity-60 font-poppins"
        >
          With your personal instructor
        </p>
        <div id="buttons" class="flex gap-12 lg:ml-12">
          <SkewedButton
            class="bg-primaryBlue hover:bg-transparent hover:skewedButton-outline"
            button-text="Gyms"
            @click="router.push({ name: 'gymsView' })"
          />
          <SkewedButton
            class="bg-transparent hover:bg-primaryBlue skewedButton-outline"
            button-text="Instructors"
            @click="router.push({ name: 'instructorsView' })"
          />
        </div>
      </div>
      <div id="right" class="relative hidden lg:mt-0 lg:col-span-5 lg:flex">
        <img
          class=""
          src="@/assets/images/triangle.svg"
          alt="Transparent Triangle"
        />
        <img
          class="absolute w-[1150px] h-full"
          src="@/assets/images/herosect.png"
          alt="Athlete"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.skewed {
  background-color: red;
  padding: 5px;
  transform: skew(-21deg);
}
.skewed span {
  display: inline-block;
  transform: skew(21deg);
}
</style>
