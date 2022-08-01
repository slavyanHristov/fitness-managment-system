<script setup>
import { ref } from "vue";
import UserService from "@/services/API-calls/UserService";
import InputField from "./InputField.vue";
import MainButton from "./MainButton.vue";
const emit = defineEmits(["closeModal"]);
const user = ref({
  email: "",
});
const successMessage = ref("");
const errorMsg = ref(null);
const isSuccessful = ref(false);

const resetPasswordRequest = async () => {
  try {
    errorMsg.value = null;
    const res = await UserService.requestPasswordReset(user.value);
    console.log(res);
    isSuccessful.value = true;
    successMessage.value = "Success! Check your mailbox.";
    setTimeout(() => emit("closeModal"), 3000);
  } catch (err) {
    if (err.response && err.response.data) {
      errorMsg.value = err.response.data.message;
    }
    console.log(err);
  }
};
</script>

<template>
  <div class="p-6 space-y-6 bg-primaryBgWhite dark:bg-accentDark">
    <div class="w-96">
      <p class="text-base leading-relaxed text-center">
        Enter email address associated with your account and we'll send you a
        link to reset your password.
      </p>
    </div>
    <form class="bg-inherit" @submit.prevent="resetPasswordRequest">
      <InputField
        v-model:inputContent="user.email"
        input-id="email"
        input-type="email"
        :failure-errors="errorMsg"
        label-text="Email"
      />
      <div
        v-if="isSuccessful"
        class="mb-5 text-xs text-center text-green-500 font-inter"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="errorMsg"
        class="mb-5 text-xs text-center text-red-500 font-inter"
      >
        {{ errorMsg }}
      </div>

      <MainButton button-text="Continue" />
    </form>
  </div>
</template>
