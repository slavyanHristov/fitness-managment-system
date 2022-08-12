<script setup>
import { ref, inject, computed } from "vue";
import UserService from "@/services/API-calls/UserService";
import { useImgStore } from "@/stores/imgStore";
import EditIcon from "@/components/icons/EditIcon.vue";
import Toast from "@/components/ui/Toast.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";
import SuccessIcon from "@/components/icons/SuccessIcon.vue";
import SaveIcon from "../icons/SaveIcon.vue";

const imgStore = useImgStore();
const toastType = ref("");
const toastMsg = ref("");
const apiUrlPath = inject("apiUrlPath");
const selectedPicture = ref(null);
let profilePicturePath = ref("");
let user = ref(null);

const loadUserInfo = async () => {
  try {
    const response = await UserService.getUserData();
    // Omits id and userTypeId
    const { id, userId, userTypeId, ...rest } = response.data.user;
    user.value = rest;
    imgStore.setImg(apiUrlPath + user.value.image.path); // create const for returned datas
    profilePicturePath.value = imgStore.getImg;
  } catch (err) {
    console.log(err);
  }
};
await loadUserInfo();

const showToast = (type, message) => {
  toastType.value = type;
  toastMsg.value = message;
  setTimeout(() => {
    toastMsg.value = "";
  }, 2000);
};

const selectImage = (event) => {
  console.log(event);
  if (event.target.files.length !== 0) {
    if (event.target.files[0].type.startsWith("image")) {
      selectedPicture.value = event.target.files[0];
      // for previewing the selected image before user decides to update it
      profilePicturePath.value = URL.createObjectURL(event.target.files[0]);
    } else {
      showToast("error", "Only image files are allowed!");
    }
  }
};

const uploadImage = async () => {
  try {
    let formData = new FormData();
    // formData.append("userId", userId);
    formData.append("profilePic", selectedPicture.value);
    const response = await UserService.changeProfilePicture(formData);
    imgStore.setImg(apiUrlPath + response.data.profilePicture.path);
    profilePicturePath.value = imgStore.getImg;
    selectedPicture.value = null;
    showToast("success", response.data.message);
  } catch (err) {
    console.log(err);
  }
};

const userDetails = computed(() => {
  return Object.entries(user.value).filter(([key]) => {
    return key !== "image";
  });
});
</script>
<template>
  <div id="main" class="">
    <Toast
      class="top-[55px]"
      :toast-msg="toastMsg"
      :is-toast-active="toastMsg"
      :toast-type="toastType"
    >
      <template #icon>
        <SuccessIcon v-if="toastType === 'success'" />
        <ErrorIcon v-if="toastType === 'error'" />
      </template>
    </Toast>
    <div v-if="user" id="user-details" class="">
      <header class="flex flex-col justify-end w-full h-72">
        <div class="relative flex items-center justify-between w-full h-1/2">
          <div
            id="profile-picture"
            class="absolute inline-block ml-20 bg-black rounded-full top-10 md:top-0 group"
          >
            <img
              class="w-40 h-40 transition-opacity rounded-full cursor-pointer md:w-60 md:h-60 bg-blend-multiply group-hover:opacity-60"
              :src="profilePicturePath"
              alt="Profile Picture"
              @click="$refs.profilePic.click()"
            />
            <transition>
              <button
                v-if="selectedPicture"
                class="absolute p-1 -translate-x-1/2 bg-green-500 rounded-full -bottom-3 left-1/2"
                @click="uploadImage"
              >
                <SaveIcon class="" />
              </button>
            </transition>
            <div
              class="absolute hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer left-1/2 top-1/2 group-hover:block"
            >
              <EditIcon @click="$refs.profilePic.click()" />
            </div>
            <input
              ref="profilePic"
              class="hidden"
              accept="image/*"
              type="file"
              @change="selectImage"
            />
          </div>
          <h1
            class="mt-10 ml-64 text-3xl font-normal drop-shadow-solidSm text-primaryWhite md:text-5xl md:ml-96 font-poppins-normal"
          >
            {{ user.name }}
          </h1>
        </div>
      </header>
      <div class="flex w-full h-12 border-b-2 dark:border-black"></div>

      <section class="flex items-center justify-center">
        <div
          v-if="user"
          class="w-10/12 my-20 rounded-lg bg-primaryBgWhite dark:bg-accentDark"
        >
          <div class="flex w-full p-2 border-b-2 dark:border-primaryDark">
            <img class="w-8 h-8" src="@/assets/icons/info.svg" alt="About" />
            <h1 class="ml-3">About</h1>
          </div>
          <div class="grid grid-cols-1 my-6 md:grid-cols-2">
            <div v-for="detail in userDetails" :key="detail.id">
              <div class="flex items-center p-6">
                <img
                  class="w-7 h-7"
                  :src="'src/assets/icons/' + detail[0] + '.svg'"
                  alt="img"
                />
                <span class="pl-3 italic font-normal font-poppins-normal">{{
                  detail[1]
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
header {
  background-image: linear-gradient(
      rgba(27, 154, 252, 0.418),
      rgba(37, 205, 247, 0.493)
    ),
    url("@/assets/images/my-profile-cover.jpg");
  background-size: cover;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
