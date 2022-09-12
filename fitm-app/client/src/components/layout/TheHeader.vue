<script setup>
import ThemeToggler from "@/components/ui/ThemeToggler.vue";
import AuthUserNavItems from "@/components/ui/AuthUserNavItems.vue";
import ProfilePicture from "../ui/ProfilePicture.vue";
import ProfilePictureSkeleton from "../skeleton-loaders/ProfilePictureSkeleton.vue";
import Logo from "@/components/ui/Logo.vue";
// import ManagerMenuItems from "@/components/ui/ManagerMenuItems.vue";
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
// const props = defineProps(["userData"]);

const authStore = useAuthStore();
const scrolledNav = ref(null);
const mobile = ref(null);
const mobileNav = ref(null);
const windowWidth = ref(null);

const toggleMobileNav = () => {
  mobileNav.value = !mobileNav.value;
};

const checkScreen = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value <= 768) {
    mobile.value = true;
    return;
  }
  mobile.value = false;
  mobileNav.value = false;
  return;
};

// const updateScroll = () => {
//   const scrollPosition = window.scrollY;
//   if (scrollPosition > 50) {
//     scrolledNav.value = true;
//     return;
//   }
//   scrolledNav.value = false;
//   return;
// };

const loggedInUser = computed(() => {
  return authStore.getUserState.user;
});

onMounted(() => {
  window.addEventListener("resize", checkScreen);
  checkScreen();
  //   window.addEventListener("scroll", updateScroll);
});
</script>

<template>
  <header
    :class="{ 'scrolled-nav': scrolledNav }"
    class="fixed top-0 left-0 z-40 w-full transition-all bg-primaryBgWhite dark:bg-accentDark"
  >
    <nav
      class="relative flex items-center justify-between transition-all px-10p"
    >
      <Logo />
      <div class="flex items-center flex-1 text-sm lg:text-base">
        <div v-show="!mobile" id="navigation" class="flex items-center flex-1">
          <div class="flex ml-9">
            <router-link id="link" class="router-views" :to="{ name: 'about' }"
              >About</router-link
            >
          </div>
          <div
            v-if="!loggedInUser"
            class="flex items-center justify-end flex-1 mr-9"
          >
            <router-link id="link" class="router-views" :to="{ name: 'login' }"
              >Login</router-link
            >
            <router-link
              id="link"
              class="router-views"
              :to="{ name: 'registerClient' }"
              >Register</router-link
            >
          </div>
          <div
            v-if="loggedInUser"
            class="flex items-center justify-end flex-1 mr-9"
          >
            <AuthUserNavItems />
            <div>
              <!-- <button class="router-views" @click="logoutAction">Logout</button> -->
            </div>
          </div>
          <ThemeToggler />
        </div>
      </div>
      <!--PROFILE PIC-->

      <div class="flex items-center ml-8">
        <div v-if="loggedInUser">
          <Suspense>
            <template #default>
              <div>
                <ProfilePicture />
              </div>
            </template>
            <template #fallback>
              <ProfilePictureSkeleton />
            </template>
          </Suspense>
        </div>
        <div
          v-show="mobile"
          id="icon"
          :class="{ 'icon-active': mobileNav }"
          class="pl-3 cursor-pointer group"
          @click="toggleMobileNav"
        >
          <span class="hamburger-spans"></span>
          <span
            class="hamburger-spans group-hover:translate-x-2 group-hover:bg-primaryBlue"
          ></span>
          <span class="hamburger-spans"></span>
        </div>
      </div>
      <transition name="mobile-nav">
        <div
          v-show="mobileNav"
          id="dropdown-nav"
          class="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full border-r dark:border-gray-700 max-w-xxs solid lightMode-colors darkMode-colors"
        >
          <div
            class="py-2 mt-10 text-center uppercase"
            @click="mobileNav = false"
          >
            <router-link id="link" class="router-views" :to="{ name: 'about' }"
              >About</router-link
            >
          </div>
          <div v-if="!loggedInUser">
            <div class="py-2 text-center uppercase" @click="mobileNav = false">
              <router-link
                id="link"
                class="router-views"
                :to="{ name: 'login' }"
                >Login</router-link
              >
            </div>
            <div class="py-2 text-center uppercase" @click="mobileNav = false">
              <router-link
                id="link"
                class="router-views"
                :to="{ name: 'register' }"
                >Register</router-link
              >
            </div>
          </div>
          <div v-if="loggedInUser" class="flex flex-col">
            <AuthUserNavItems
              :is-flex-column="true"
              @close-mobile-nav="mobileNav = false"
            />
          </div>

          <ThemeToggler class="mt-10" />
        </div>
      </transition>
    </nav>
  </header>
</template>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: 1s ease all;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  transform: translateX(-250px);
}
.mobile-nav-enter-to {
  transform: translateX(0);
}
#icon.icon-active span:nth-child(1) {
  transform: translate(-3px, 7px) rotate(45deg);
}
#icon.icon-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(15px);
}
#icon.icon-active span:nth-child(3) {
  transform: translate(-3px, -9px) rotate(-45deg);
}
#icon.icon-active:hover span {
  background-color: #1b9cfc;
}
</style>
