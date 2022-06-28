<script setup>
import { ref } from "vue";
import AuthService from "@/services/AuthService";
import InputField from "./InputField.vue";
import SubmitButton from "./SubmitButton.vue";
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
    const res = await AuthService.requestPasswordReset(user.value);
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
        inputId="email"
        inputType="email"
        :failureErrors="errorMsg"
        labelText="Email"
        v-model:inputContent="user.email"
      />
      <div
        class="mb-5 text-xs text-center text-green-500 font-inter"
        v-if="isSuccessful"
      >
        {{ successMessage }}
      </div>
      <div
        class="mb-5 text-xs text-center text-red-500 font-inter"
        v-if="errorMsg"
      >
        {{ errorMsg }}
      </div>

      <SubmitButton buttonText="Continue" />
    </form>
  </div>
</template>
