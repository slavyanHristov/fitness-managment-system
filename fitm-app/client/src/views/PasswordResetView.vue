<script setup>
import { ref, onMounted, computed } from "vue";
import AuthService from "@/services/AuthService";
import InputField from "@/components/ui/InputField.vue";

import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import SubmitButton from "@/components/ui/SubmitButton.vue";

const route = useRoute();
const user = ref({
  email: "",
  token: "",
  newPassword: "",
  confirmPassword: "",
});

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Field cannot be empty!", required),
      email: helpers.withMessage("Not a valid email!", email),
    },
    newPassword: {
      required: helpers.withMessage("Field cannot be empty!", required),
    },
    confirmPassword: {
      required: helpers.withMessage("Field cannot be empty!", required),
      sameAs: helpers.withMessage(
        "Passwords do not match!",
        sameAs(user.value.newPassword)
      ),
    },
  };
});
const v$ = useVuelidate(rules, user);
const errors = ref(null);

onMounted(() => {
  console.log(route.query.token);
});

const newPassword = async () => {
  try {
    // TODO: reset errors on click
    // TODO: print success message on click
    // TODO: Set timeout 2 sec and push to login page or home page
    const hasValidationPassed = await v$.value.$validate();

    if (hasValidationPassed) {
      user.value.token = route.query.token;
      const res = await AuthService.newPassword(user.value);
    }
  } catch (err) {
    if (err.response && err.response.data)
      errors.value = err.response.data.errors;
    console.log(err);
  }
};
</script>

<template>
  <div class="flex items-center justify-center flex-auto h-screen min-w-full">
    <div class="container h-full">
      <div class="flex flex-wrap items-center justify-center w-auto h-full">
        <div class="hidden mb-12 lg:block md:w-8/12 lg:w-6/12 md:mb-0">
          <img
            src="@/assets/images/forgot_password.svg"
            alt="Forgot password image"
          />
        </div>
        <div
          class="flex flex-col items-center justify-center min-h-full gap-16 sm:mb-9 md:w-8/12 lg:w-5/12 lg:ml-10"
        >
          <div>
            <h1 class="uppercase font-inter">Password reset</h1>
          </div>
          <form class="w-full" @submit.prevent="newPassword">
            <InputField
              inputId="email"
              inputType="email"
              :inputErrors="errors"
              :vuelidateErrors="v$.email.$errors"
              v-model:inputContent="user.email"
              labelText="Email"
            />
            <InputField
              inputId="password"
              inputType="password"
              :inputErrors="errors"
              :vuelidateErrors="v$.newPassword.$errors"
              v-model:inputContent="user.newPassword"
              labelText="New Password"
            />
            <InputField
              inputId="confPassword"
              inputType="password"
              :inputErrors="errors"
              :vuelidateErrors="v$.confirmPassword.$errors"
              v-model:inputContent="user.confirmPassword"
              labelText="Confirm New Password"
            />
            <SubmitButton buttonText="Change password" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
