<script setup>
import { ref, onMounted, computed } from "vue";
import InputField from "@/components/ui/InputField.vue";
import AdminAPI from "../../services/axios-instances/AdminAPI";

import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import MainButton from "@/components/ui/MainButton.vue";

const user = ref({
  name: {
    label: "Full Name",
    inputId: "fullName",
    inputType: "text",
    value: "",
  },
  username: {
    label: "Username",
    inputId: "username",
    inputType: "text",
    value: "",
  },
  password: {
    label: "Password",
    inputId: "password",
    inputType: "password",
    value: "",
  },
  confirmPassword: {
    label: "Confirm Password",
    inputId: "confirmPassword",
    inputType: "password",
    value: "",
  },
  email: {
    label: "Email",
    inputId: "email",
    inputType: "text",
    value: "",
  },
});

const rules = computed(() => {
  return {
    name: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    username: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },

    password: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    confirmPassword: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        sameAs: helpers.withMessage(
          "Passwords do not match!",
          sameAs(user.value.password.value)
        ),
      },
    },
    email: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
  };
});

const v$ = useVuelidate(rules, user);

onMounted(() => {});
const errors = ref(null);
const isSuccessful = ref(false);
const successMessage = ref("");

const registerAction = async () => {
  const hasValidationPassed = await v$.value.$validate();
  console.log(hasValidationPassed);
  if (hasValidationPassed) {
    console.log(user.value);
    isSuccessful.value = false;
    errors.value = null;
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
        <div v-for="(field, index) in user">
          <!-- {{ index }} -->
          <InputField
            v-model:inputContent="field['value']"
            :input-type="field['inputType']"
            :input-id="field['inputId']"
            :vuelidate-errors="v$[index].$errors"
            :label-text="field['label']"
          />
        </div>

        <div
          v-show="isSuccessful"
          class="mb-5 text-xs text-center text-green-500 font-inter"
        >
          {{ successMessage }}
        </div>
        <MainButton button-text="Register Manager" />
      </div>
    </form>
  </div>
</template>
