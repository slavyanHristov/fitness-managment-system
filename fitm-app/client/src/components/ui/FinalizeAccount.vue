<script setup>
import AuthService from "@/services/AuthService";

import { ref, computed, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import InputField from "./InputField.vue";

import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers } from "@vuelidate/validators";
import SubmitButton from "./SubmitButton.vue";

const props = defineProps(["newManagerDetails"]);
const emit = defineEmits(["closeModal"]);
const authStore = useAuthStore();
const userId = authStore.getCurrentUser.userId;

const user = ref({
  userId: userId,
  name: "",
  password: "",
  confirmPassword: "",
});

onUnmounted(async () => {
  console.log("Finalize Account Unmounted");
  // If user tries to bypass account finalization by for example returning to the previous page
  // logout the user
  if (isSuccessful.value === false) {
    await authStore.logout();
  }
});

// window.onbeforeunload = () => {
//   if (isSuccessful.value === false) {
//     return true;
//   }
// };

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Field cannot be empty", required),
    },
    password: {
      required: helpers.withMessage("Field cannot be empty!", required),
    },
    confirmPassword: {
      required: helpers.withMessage("Field cannot be empty!", required),
      sameAs: helpers.withMessage(
        "Passwords do not match!",
        sameAs(user.value.password)
      ),
    },
  };
});

const v$ = useVuelidate(rules, user);
const errors = ref(null);
const isSuccessful = ref(false);
const successMessage = ref("");
user.value.name = props.newManagerDetails.name;

const updateAccountDetails = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();

    if (hasValidationPassed) {
      errors.value = null;
      const res = await AuthService.finalizeAccount(user.value);
      isSuccessful.value = true;
      successMessage.value = res.data.message;
      console.log("Done");
      setTimeout(() => emit("closeModal"), 1500);
    }
  } catch (err) {
    if (err.response && err.response.data)
      errors.value = err.response.data.errors;
    console.log(err);
  }
};
</script>

<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form class="w-96 bg-inherit" @submit.prevent="updateAccountDetails">
      <InputField
        inputType="text"
        inputId="name"
        :inputErrors="errors"
        :vuelidateErrors="v$.name.$errors"
        v-model:inputContent="user.name"
        labelText="Full Name"
      />
      <InputField
        inputType="password"
        inputId="password"
        :inputErrors="errors"
        :vuelidateErrors="v$.password.$errors"
        v-model:inputContent="user.password"
        labelText="Password"
      />
      <InputField
        inputType="password"
        inputId="confPassword"
        :inputErrors="errors"
        :vuelidateErrors="v$.confirmPassword.$errors"
        v-model:inputContent="user.confirmPassword"
        labelText="Confirm Password"
      />
      <div
        class="mb-5 text-xs text-center text-green-500 font-inter"
        v-if="isSuccessful"
      >
        {{ successMessage }}
      </div>
      <SubmitButton buttonText="Continue" />
    </form>
  </div>
</template>
