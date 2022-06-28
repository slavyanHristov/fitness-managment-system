<template>
  <footer class="text-center lightMode-colors darkMode-colors">
    <div class="px-6 pt-6">
      <div class="flex justify-center mb-6">
        <button>FB</button>
        <button>Google</button>
        <button>Twitter</button>
      </div>
      <div>
        <form action="">
          <div
            class="grid items-center justify-center grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div class="md:ml-auto md:mb-6">
              <p>
                <strong>Sign up for our newsletter</strong>
              </p>
            </div>
            <div class="md:mb-6">
              <input
                type="text"
                class="block w-full px-3 py-1.5 text-base font-normal placeholder-gray-800 dark:placeholder-primaryWhite bg-white dark:bg-primaryDark bg-clip-padding border border-solid border-primaryBlue rounded transition ease-in-out m-0 focus:outline-none"
                placeholder="Email address"
              />
            </div>
            <div class="mb-6 md:mr-auto">
              <button
                type="submit"
                class="inline-block px-6 py-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border rounded border-primaryBlue hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
              >
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="mb-6">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
          distinctio earum repellat quaerat voluptatibus placeat nam, commodi
          optio pariatur est quia magnam eum harum corrupti dicta, aliquam sequi
          voluptate quas.
        </p>
      </div>
      <div class="grid lg:grid-cols-4 md:grid-cols-2">
        <div class="mb-6">
          <h5 class="uppercase font-bold mb-2.5">Links</h5>
          <ul class="mb-0 list-none">
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
          </ul>
        </div>
        <div class="mb-6">
          <h5 class="uppercase font-bold mb-2.5">Links</h5>
          <ul class="mb-0 list-none">
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
          </ul>
        </div>
        <div class="mb-6">
          <h5 class="uppercase font-bold mb-2.5">Links</h5>
          <ul class="mb-0 list-none">
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
          </ul>
        </div>
        <div class="mb-6">
          <h5 class="uppercase font-bold mb-2.5">Links</h5>
          <ul class="mb-0 list-none">
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'home' }">Example</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="p-4 text-center">© 2022 Copyright: Fit/M</div>
    </div>
  </footer>
</template>
