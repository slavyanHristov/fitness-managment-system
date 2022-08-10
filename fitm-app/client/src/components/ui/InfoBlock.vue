<script setup>
const props = defineProps(["info", "colorTop", "colorBottom", "title"]);
</script>

<template>
  <div
    :class="'flex relative flex-col rounded-xl gap-3 w-full h-48 items-center justify-center p-6 bg-gradient-to-t ' +
      props.colorTop +
      ' ' +
      props.colorBottom
    "
  >
    <h3 class="absolute left-10 top-5 text-primaryDark">{{ props.title }}</h3>
    <div class="flex items-center justify-center gap-4 px-12">
      <slot name="icon"></slot>
      <h1 class="text-5xl uppercase text-primaryDark">
        {{ props.info }}
      </h1>
    </div>
  </div>
</template>
