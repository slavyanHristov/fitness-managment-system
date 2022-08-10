<script setup>
import { ref, inject } from "vue";
import { useImgStore } from "@/stores/imgStore";
import Dropdown from "./Dropdown.vue";

const imgStore = useImgStore();
const apiUrlPath = inject("apiUrlPath");
const userData = async () => {
  try {
    const imgPath = await imgStore.getImageAsync();
    imgStore.setImg(apiUrlPath + imgPath);
  } catch (err) {
    console.log(err);
  }
};
await userData();

const isOpen = ref(false);
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center w-10 h-10"
    @mouseleave="isOpen = false"
    @mouseover="isOpen = true"
  >
    <div class="inline-block w-full h-full p-0 bg-black rounded-full group">
      <img
        class="block w-full h-full transition-all border-2 rounded-full cursor-pointer hover:opacity-60 border-primaryBlue"
        :src="imgStore.getImg"
        alt=""
      />
    </div>
    <transition>
      <Dropdown v-if="isOpen" />
    </transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
