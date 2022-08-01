<script setup>
import { ref, onMounted, computed } from "vue";
import UserService from "@/services/API-calls/UserService";
import InputField from "@/components/ui/InputField.vue";

import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import MainButton from "@/components/ui/MainButton.vue";

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
      await UserService.newPassword(user.value);
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
              v-model:inputContent="user.email"
              input-id="email"
              input-type="email"
              :input-errors="errors"
              :vuelidate-errors="v$.email.$errors"
              label-text="Email"
            />
            <InputField
              v-model:inputContent="user.newPassword"
              input-id="password"
              input-type="password"
              :input-errors="errors"
              :vuelidate-errors="v$.newPassword.$errors"
              label-text="New Password"
            />
            <InputField
              v-model:inputContent="user.confirmPassword"
              input-id="confPassword"
              input-type="password"
              :input-errors="errors"
              :vuelidate-errors="v$.confirmPassword.$errors"
              label-text="Confirm New Password"
            />
            <MainButton button-text="Change password" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
