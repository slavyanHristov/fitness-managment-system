<script setup>
import { ref, computed } from "vue";
import InputField from "@/components/ui/InputField.vue";
import { useAuthStore } from "@/stores/authStore";

import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import MainButton from "@/components/ui/MainButton.vue";

const authStore = useAuthStore();

const user = ref({
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Field cannot be empty!", required),
    },
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
              v-model:inputContent.trim="user.name"
              input-id="name"
              input-type="text"
              :input-errors="errors"
              :vuelidate-errors="v$.name.$errors"
              label-text="Full Name"
            />
            <InputField
              v-model:inputContent.trim="user.username"
              input-id="username"
              input-type="text"
              :input-errors="errors"
              :vuelidate-errors="v$.username.$errors"
              label-text="Username"
            />

            <InputField
              v-model:inputContent.trim="user.password"
              input-id="password"
              input-type="password"
              :input-errors="errors"
              :vuelidate-errors="v$.password.$errors"
              label-text="Password"
            />
            <InputField
              v-model:inputContent.trim="user.confirmPassword"
              input-id="confPassword"
              input-type="password"
              :vuelidate-errors="v$.confirmPassword.$errors"
              label-text="Confirm Password"
            />
            <InputField
              v-model:inputContent.trim="user.email"
              input-id="email"
              input-type="email"
              :input-errors="errors"
              :vuelidate-errors="v$.email.$errors"
              label-text="Email"
            />

            <!-- <input type="file" name="file" @change="onFileSelected" /> -->

            <div
              v-show="isSuccessful"
              class="text-xs text-center text-green-500 font-inter"
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
              <MainButton button-text="Sign up" />
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
