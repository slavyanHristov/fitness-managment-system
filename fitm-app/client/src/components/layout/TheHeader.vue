<script setup>
import ThemeToggler from "@/components/ui/ThemeToggler.vue";
import AuthUserNavItems from "@/components/ui/AuthUserNavItems.vue";
// import ManagerMenuItems from "@/components/ui/ManagerMenuItems.vue";
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
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

const updateScroll = () => {
  const scrollPosition = window.scrollY;
  if (scrollPosition > 50) {
    scrolledNav.value = true;
    return;
  }
  scrolledNav.value = false;
  return;
};

const loggedInUser = computed(() => {
  return authStore.getUserState.user;
});

onMounted(() => {
  window.addEventListener("resize", checkScreen);
  checkScreen();
  window.addEventListener("scroll", updateScroll);
});

const logoutAction = async () => {
  if (authStore.getUserState.status.isLoggedIn) {
    await authStore.logout();
    router.push({ name: "home" });
    if (mobileNav.value === true) {
      mobileNav.value = false;
    }
  }
};
</script>

<template>
  <header
    :class="{ 'scrolled-nav': scrolledNav }"
    class="fixed top-0 left-0 z-40 w-full transition-all bg-primaryBgWhite dark:bg-accentDark"
  >
    <nav class="flex items-center justify-between transition-all px-10p">
      <div id="branding">
        <router-link :to="{ name: 'home' }">
          <h1
            class="py-2 text-3xl italic font-extrabold text-transparent transition-all select-none bg-gradient-to-t from-primaryBlue to-accentBlue bg-clip-text font-poppins"
          >
            FIT/M
          </h1>
        </router-link>
      </div>

      <div v-show="!mobile" class="flex items-center flex-1" id="navigation">
        <div class="flex ml-9">
          <router-link class="router-views" id="link" :to="{ name: 'about' }"
            >About</router-link
          >
        </div>
        <div
          v-if="!loggedInUser"
          class="flex items-center justify-end flex-1 mr-9"
        >
          <router-link class="router-views" id="link" :to="{ name: 'login' }"
            >Login</router-link
          >
          <router-link class="router-views" id="link" :to="{ name: 'register' }"
            >Register</router-link
          >
        </div>
        <div
          class="flex items-center justify-end flex-1 mr-9"
          v-if="loggedInUser"
        >
          <AuthUserNavItems />
          <div>
            <button class="router-views" @click="logoutAction">Logout</button>
          </div>
        </div>
        <ThemeToggler />
      </div>
      <div class="flex">
        <div
          @click="toggleMobileNav"
          v-show="mobile"
          :class="{ 'icon-active': mobileNav }"
          class="pl-3 cursor-pointer group"
          id="icon"
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
          class="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full border-r dark:border-gray-700 max-w-xxs solid lightMode-colors darkMode-colors"
          id="dropdown-nav"
        >
          <div
            @click="mobileNav = false"
            class="py-2 mt-10 text-center uppercase"
          >
            <router-link id="link" :to="{ name: 'about' }">About</router-link>
          </div>
          <div v-if="!loggedInUser">
            <div @click="mobileNav = false" class="py-2 text-center uppercase">
              <router-link id="link" :to="{ name: 'login' }">Login</router-link>
            </div>
            <div @click="mobileNav = false" class="py-2 text-center uppercase">
              <router-link id="link" :to="{ name: 'register' }"
                >Register</router-link
              >
            </div>
          </div>
          <div class="flex flex-col" v-if="loggedInUser">
            <AuthUserNavItems @closeMobileNav="mobileNav = false" />
            <button class="router-views" @click="logoutAction">Logout</button>
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
