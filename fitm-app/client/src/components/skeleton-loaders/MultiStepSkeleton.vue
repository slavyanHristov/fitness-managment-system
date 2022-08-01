<template>
  <div class="container h-full bg-primaryWhite dark:bg-primaryDark">
    <div class="flex items-center justify-center min-h-screen">
      <div
        id="container"
        class="w-full max-w-3xl rounded-sm animate-pulse bg-primaryBgWhite dark:bg-accentDark"
      >
        <div id="form-container" class="px-6 py-8">
          <div id="indicator" class="w-4/5 m-auto mb-12"></div>
          <div class="flex flex-col items-center justify-center gap-5">
            <div
              v-for="(i, z) in 3"
              :key="z"
              class="w-full h-10 rounded-full bg-darkerWhite dark:bg-testColor"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
