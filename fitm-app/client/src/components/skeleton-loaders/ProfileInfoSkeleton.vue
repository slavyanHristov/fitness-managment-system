<template>
  <div id="main">
    <div id="user-details">
      <header
        class="flex flex-col justify-end w-full bg-gray-200 h-72 dark:bg-accentGray"
      >
        <div class="relative flex items-center justify-between w-full h-1/2">
          <div
            id="profile-picture"
            class="absolute inline-block w-40 h-40 ml-20 rounded-full animate-pulse bg-darkerWhite dark:bg-primaryGray md:w-60 md:h-60 top-10 md:top-0"
          ></div>
          <div
            id="h1"
            class="h-10 mt-10 ml-64 rounded-full animate-pulse bg-darkerWhite dark:bg-primaryGray w-96 md:ml-96"
          ></div>
        </div>
      </header>
      <div class="flex w-full h-12"></div>
      <section class="flex items-center justify-center">
        <div
          class="w-10/12 my-20 rounded-lg bg-primaryBgWhite dark:bg-accentDark"
        >
          <div
            class="flex w-full h-12 p-2 border-b-2 dark:border-primaryDark"
          ></div>
          <div class="grid grid-cols-1 my-6 md:grid-cols-2">
            <div
              class="w-1/2 h-6 mb-6 rounded-full bg-darkerWhite animate-pulse dark:bg-primaryGray"
            ></div>
            <div
              class="w-1/2 h-6 mb-6 rounded-full bg-darkerWhite animate-pulse dark:bg-primaryGray"
            ></div>
            <div
              class="w-1/2 h-6 mb-6 rounded-full bg-darkerWhite animate-pulse dark:bg-primaryGray"
            ></div>
            <div
              class="w-1/2 h-6 mb-6 rounded-full bg-darkerWhite animate-pulse dark:bg-primaryGray"
            ></div>
            <div
              class="w-1/2 h-6 mb-6 rounded-full bg-darkerWhite animate-pulse dark:bg-primaryGray"
            ></div>
            <div
              class="w-1/2 h-6 mb-6 rounded-full bg-darkerWhite animate-pulse dark:bg-primaryGray"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
