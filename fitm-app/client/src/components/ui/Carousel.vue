<script setup>
import { ref } from "vue";

import LeftArrowIcon from "@/components/icons/LeftArrowIcon.vue";
import RightArrowIcon from "@/components/icons/RightArrowIcon.vue";

const props = defineProps({
  numOfSlides: {
    type: Number,
    required: true,
  },
  isAutoPlayEnabled: {
    type: Boolean,
    default: true,
  },
  timeoutDuration: {
    type: Number,
    default: 5000,
  },
  isNavEnabled: {
    type: Boolean,
    default: true,
  },
  isPaginationEnabled: {
    type: Boolean,
    default: true,
  },
});

const currentSlide = ref(1);
let autoPlayInterval = null;

//next slide
const nextSlide = (event) => {
  // if next or previous button is clicked reset the interval of autoplay if its enabled
  if (event && props.isAutoPlayEnabled) {
    resetInterval();
  }
  if (currentSlide.value === props.numOfSlides) {
    currentSlide.value = 1;
    return;
  }
  currentSlide.value += 1;
};
// previous slide
const prevSlide = (event) => {
  // if next or previous button is clicked reset the interval of autoplay if its enabled
  if (event && props.isAutoPlayEnabled) {
    resetInterval();
  }
  if (currentSlide.value === 1) {
    currentSlide.value = props.numOfSlides;
    return;
  }
  currentSlide.value -= 1;
};

const goToSlide = (slide) => {
  if (props.isAutoPlayEnabled) {
    resetInterval();
  }
  currentSlide.value = slide;
};

const resetInterval = () => {
  clearInterval(autoPlayInterval);
  autoPlay();
};

// autoplay
const autoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, props.timeoutDuration);
};

if (props.isAutoPlayEnabled) {
  autoPlay();
}
</script>

<template>
  <div>
    <slot :current-slide="currentSlide" name="slide"></slot>
    <div
      v-if="props.isNavEnabled"
      id="navigate"
      class="absolute flex items-center justify-center w-full h-full px-4"
    >
      <div id="left" class="flex flex-1">
        <LeftArrowIcon @click="prevSlide" />
      </div>
      <div id="right" class="flex justify-end flex-1">
        <RightArrowIcon @click="nextSlide" />
      </div>
    </div>
    <div
      v-if="props.isPaginationEnabled"
      id="pagination"
      class="absolute flex items-center justify-center w-full gap-4 bottom-6"
    >
      <span
        v-for="(slide, index) in props.numOfSlides"
        :key="index"
        class="w-5 h-5 rounded-full cursor-pointer"
        :class="
          slide === currentSlide
            ? 'bg-primaryBlue'
            : 'bg-transparent outline outline-2 outline-primaryBlue outline-offset-[-2px]'
        "
        @click="goToSlide(slide)"
      >
      </span>
    </div>
  </div>
</template>
