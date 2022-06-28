<script setup>
import { ref, onMounted, computed } from "vue";
import InputField from "@/components/ui/InputField.vue";
import AdminAPI from "../../services/axios-instances/AdminAPI";

import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import SubmitButton from "@/components/ui/SubmitButton.vue";

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
      required: helpers.withMessage("Field cannot be empty", required),
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
const emailDetails = ref({
  sender: "fitM@corp.com",
  recipient: user.value.email,
  subject: "Welcome to our organization!",
  tempPassword: user.value.password,
});
onMounted(() => {
  console.log(user.value.email);
});
const errors = ref(null);
const isSuccessful = ref(false);
const successMessage = ref("");

const sendEmail = async () => {
  try {
    const mailInfo = await AdminAPI.mailToManager(emailDetails.value);
    console.log(mailInfo);
  } catch (err) {
    console.log(err);
  }
};

const registerAction = async () => {
  isSuccessful.value = false;
  errors.value = null;
  try {
    const hasValidationPassed = await v$.value.$validate();

    if (hasValidationPassed) {
      const response = await AdminAPI.registerManager(user.value);
      // if (response) {
      //   console.log(response);
      //   emailDetails.value.recipient = response.data["newManager"]["email"];
      //   emailDetails.value.tempPassword = user.value.password;
      //   await sendEmail();
      //   // const mailInfo = await AdminAPI.mailToManager(emailDetails.value);
      // }
      isSuccessful.value = true;
      successMessage.value = response.data.message;
      console.log(response);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errors.value = err.response.data.errors;
    }
    console.log(err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <h1 class="font-poppins">Register a new manager to the system</h1>
    <form
      class="flex items-center justify-center w-full"
      @submit.prevent="registerAction"
    >
      <div
        class="w-5/12 p-6 transition-all rounded shadow-sm bg-primaryWhite dark:bg-accentDark"
      >
        <InputField
          inputId="name"
          inputType="text"
          :inputErrors="errors"
          :vuelidateErrors="v$.name.$errors"
          v-model:inputContent="user.name"
          labelText="Full Name"
        />
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
          class="mb-5 text-xs text-center text-green-500 font-inter"
          v-show="isSuccessful"
        >
          {{ successMessage }}
        </div>
        <SubmitButton buttonText="Register Manager" />
      </div>
    </form>
  </div>
</template>
