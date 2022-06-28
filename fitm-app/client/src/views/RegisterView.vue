<script setup>
import { ref, computed } from "vue";
import InputField from "@/components/ui/InputField.vue";
import { useAuthStore } from "@/stores/authStore";

import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import SubmitButton from "@/components/ui/SubmitButton.vue";

const authStore = useAuthStore();

const user = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage("Field cannot be empty!", required),
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
    email: {
      required: helpers.withMessage("Field cannot be empty!", required),
      email: helpers.withMessage("Not a valid email!", email),
    },
  };
});

const v$ = useVuelidate(rules, user);

const errors = ref(null);
const successMessage = ref("");
const isSuccessful = ref(false);

const saveUser = async () => {
  isSuccessful.value = false;
  errors.value = null;

  try {
    const hasValidationPassed = await v$.value.$validate();

    if (hasValidationPassed) {
      let response = await authStore.register(user.value);

      console.log("User registered!");
      console.log(response);

      isSuccessful.value = true;
      successMessage.value = response.data.message;
    }
  } catch (err) {
    if (err.response && err.response.data)
      errors.value = err.response.data.errors;
    console.log(err);
  }

  // authStore.register(user.value).then(
  //   (userData) => {
  //     console.log("Registered");
  //     console.log(userData);
  //     isSuccessful.value = true;
  //     successMessage.value = userData.message;
  //   },
  //   (err) => {
  //     errors.value = err.response.data.errors;
  //     console.log(err);
  //   }
  // );

  // try {
  //   isSuccessful.value = false;
  //   errors.value = null;

  //   const response = await RegisterAPI.registerAdmin(user.value);
  //   isSuccessful.value = true;
  //   successMessage.value = response.data.message;
  // } catch (err) {
  //   errors.value = err.response.data.errors;
  //   console.log(err);
  // }
};
</script>

<template>
  <section
    class="flex items-center justify-center flex-auto min-w-full min-h-screen"
  >
    <div class="container h-full">
      <div class="flex flex-wrap items-center justify-center w-auto h-full">
        <div
          class="flex justify-center transition-all sm:mb-9 md:w-8/12 lg:w-5/12 lg:ml-10 bg-primaryWhite dark:bg-primaryDark"
        >
          <form class="w-full bg-inherit" @submit.prevent="saveUser">
            <InputField
              inputId="username"
              inputType="text"
              :inputErrors="errors"
              :vuelidateErrors="v$.username.$errors"
              v-model:inputContent="user.username"
              labelText="Username"
            />

            <InputField
              inputId="password"
              inputType="password"
              :inputErrors="errors"
              :vuelidateErrors="v$.password.$errors"
              v-model:inputContent="user.password"
              labelText="Password"
            />
            <InputField
              inputId="confPassword"
              inputType="password"
              :vuelidateErrors="v$.confirmPassword.$errors"
              v-model:inputContent="user.confirmPassword"
              labelText="Confirm Password"
            />
            <InputField
              inputId="email"
              inputType="email"
              :inputErrors="errors"
              :vuelidateErrors="v$.email.$errors"
              v-model:inputContent="user.email"
              labelText="Email"
            />

            <div
              class="text-xs text-center text-green-500 font-inter"
              v-show="isSuccessful"
            >
              {{ successMessage }}
            </div>
            <div
              class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
            ></div>
            <div class="flex flex-col items-center justify-center gap-3">
              <span
                >Already have an account?
                <router-link
                  :to="{ name: 'login' }"
                  class="font-semibold uppercase text-primaryBlue"
                  >Sign in</router-link
                ></span
              >
              <SubmitButton buttonText="Sign up" />
            </div>
          </form>
        </div>
        <div class="hidden mb-12 lg:block md:w-8/12 lg:w-6/12 md:mb-0">
          <img
            src="@/assets/images/register.svg"
            alt="Personal trainer image"
          />
        </div>
      </div>
    </div>
  </section>
</template>
