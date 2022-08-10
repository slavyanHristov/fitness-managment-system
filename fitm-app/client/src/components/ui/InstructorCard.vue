<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { inject, ref } from "vue";
import ClientService from "@/services/API-calls/ClientService";
import Toast from "@/components/ui/Toast.vue";
import SuccessIcon from "@/components/icons/SuccessIcon.vue";
import ErrorIcon from "@/components/icons/ErrorIcon.vue";

const props = defineProps(["item"]);
const emit = defineEmits(["refreshEmployees"]);

const authStore = useAuthStore();
const router = useRouter();

const apiUrlPath = inject("apiUrlPath");
const toastMsg = ref("");
const toastType = ref(null);

const showToast = (type, message) => {
  toastType.value = type;
  toastMsg.value = message;
  setTimeout(() => {
    toastMsg.value = "";
  }, 2000);
};

const hireInstructor = async () => {
  try {
    const response = await ClientService.setInstructor(
      props.item.fitness_instructor.id
    );
    console.log("Response 2: ", response.data.message);
    showToast("success", response.data.message);
  } catch (err) {
    console.log(err);
    if (err.response && err.response.data) {
      if (err.response.status === 403) {
        router.push({ name: "login" });
      } else {
        showToast("error", err.response.data.message);
      }
    }
  }
};
</script>

<template>
  <div
    v-if="props.item"
    id="container"
    class="h-full overflow-hidden rounded shadow-lg bg-primaryWhite dark:bg-testColor w-80"
  >
    <Toast
      class="top-[55px]"
      :is-toast-active="toastMsg"
      :toast-msg="toastMsg"
      :toast-type="toastType"
    >
      <template #icon>
        <ErrorIcon v-if="toastType === 'error'" />
        <SuccessIcon v-if="toastType === 'success'" />
      </template>
    </Toast>

    <div id="inner">
      <div id="header" class="flex justify-center py-1.5">
        <img
          class="object-cover rounded-full max-h-28 max-w-28"
          :src="apiUrlPath + props.item.fitness_instructor.user.image.path"
          alt="gym image"
        />
      </div>
      <div id="content" class="flex flex-col items-center justify-center">
        <h3 class="mb-2 font-bold">{{ props.item.name }}</h3>
        <p class="mb-2">{{ props.item.gym.name }}</p>
      </div>
      <div id="footer">
        <button
          v-if="
            authStore.isCurrentUserClient || authStore.isUserLoggedIn === false
          "
          class="bg-primaryBlue transition-colors hover:bg-accentBlue text-lg tracking-wider uppercase font-bold p-1.5 w-full"
          @click="hireInstructor"
        >
          Hire
        </button>
      </div>
    </div>
  </div>
</template>
