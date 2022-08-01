<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import {
  validatePhone,
  validateFullName,
  validatePassword,
  validateUsername,
  validateSalary,
} from "@/utils/customValidators";

import InputField from "@/components/ui/InputField.vue";
import MainButton from "@/components/ui/MainButton.vue";

import AdminService from "@/services/API-calls/AdminService";
import parsePayload from "@/utils/parsePayload";

const router = useRouter();
const user = ref({
  name: {
    label: "Your Name",
    inputId: "name",
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
    label: "Email Address",
    inputId: "email",
    inputType: "email",
    value: "",
  },
  salary: {
    label: "Salary",
    inputId: "salary",
    inputType: "number",
    value: "",
  },
  phone: {
    label: "Phone Number",
    inputId: "phone",
    inputType: "number",
    value: "",
  },
});

const rules = computed(() => {
  return {
    name: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateFullName: helpers.withMessage(
          "Not a valid name!",
          validateFullName
        ),
      },
    },
    username: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateUsername: helpers.withMessage(
          "Username must start with letter and can have only '-, _' as special characters!",
          validateUsername
        ),
      },
    },

    password: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validatePassword: helpers.withMessage(
          "Must have at least one uppercase, one lowercase, number and a special character!",
          validatePassword
        ),
      },
    },
    confirmPassword: {
      value: {
        required: helpers.withMessage("Field cannot be empty!", required),
        sameAs: helpers.withMessage(
          "Passwords do not match!",
          sameAs(user.value.password.value)
        ),
      },
    },
    email: {
      value: {
        required: helpers.withMessage("Field cannot be empty!", required),
        email: helpers.withMessage("Not a valid email!", email),
      },
    },
    salary: {
      value: {
        required: helpers.withMessage("Field cannot be empty!", required),
        validateSalary: helpers.withMessage(
          "Salary is not valid(should be between 3 and 4 digit length)",
          validateSalary
        ),
      },
    },
    phone: {
      value: {
        required: helpers.withMessage("Field cannot be empty!", required),
        validatePhone: helpers.withMessage(
          "Not a valid phone number format!",
          validatePhone
        ),
      },
    },
  };
});

const v$ = useVuelidate(rules, user);
// const emailDetails = ref({
//   sender: "fitM@corp.com",
//   recipient: user.value.email,
//   subject: "Welcome to our organization!",
//   tempPassword: user.value.password,
// });
onMounted(() => {
  console.log(user.value.email);
});
const errors = ref(null);
const isSuccessful = ref(false);
const successMessage = ref("");

// const sendEmail = async () => {
//   try {
//     const mailInfo = await AdminService.mailToManager(emailDetails.value);
//     console.log(mailInfo);
//   } catch (err) {
//     console.log(err);
//   }
// };

const registerAction = async () => {
  isSuccessful.value = false;
  errors.value = null;
  try {
    const hasValidationPassed = await v$.value.$validate();

    if (hasValidationPassed) {
      const userValues = parsePayload(user.value);
      const response = await AdminService.registerManager(userValues);
      // if (response) {
      //   console.log(response);
      //   emailDetails.value.recipient = response.data["newManager"]["email"];
      //   emailDetails.value.tempPassword = user.value.password;
      //   await sendEmail();
      //   // const mailInfo = await AdminService.mailToManager(emailDetails.value);
      // }
      isSuccessful.value = true;
      successMessage.value = response.data.message;
      console.log(response);
      setTimeout(() => {
        router.push({ name: "adminDashboard" });
      }, 1500);
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
  <main class="flex items-center justify-center w-full min-h-screen">
    <div
      id="split-screen"
      class="box-border flex items-center justify-center w-4/5 rounded-md h-[600px] bg-primaryBgWhite dark:bg-accentDark"
    >
      <div id="left" class="hidden w-full h-full lg:flex rounded-l-md">
        <div
          id="overlay"
          class="flex flex-col items-center justify-center gap-6 h-inherit"
        >
          <div class="flex w-2/3">
            <h1
              class="text-center uppercase lg:text-4xl xl:text-5xl text-primaryDark font-poppins"
            >
              Manager Registration
            </h1>
          </div>
          <p class="text-center text-primaryGray">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, non!
          </p>
        </div>
      </div>
      <div id="right" class="w-full">
        <form class="" @submit.prevent="registerAction">
          <div
            class="flex flex-col justify-center p-6 transition-all shadow-sm rounded-r-md bg-primaryBgWhite dark:bg-accentDark"
          >
            <h1 class="block mb-8 text-center uppercase lg:hidden font-poppins">
              Manager registration
            </h1>
            <div v-for="field in user" :key="field.id">
              <InputField
                v-model:inputContent="field.value"
                :label-text="field.label"
                :input-id="field.inputId"
                :input-type="field.inputType"
                :input-errors="errors"
                :vuelidate-errors="v$[field.inputId].$errors"
              />
            </div>
            <div
              v-show="isSuccessful"
              class="mb-5 text-xs text-center text-green-500 font-inter"
            >
              {{ successMessage }}
            </div>
            <MainButton class="mt-8" button-text="Register Manager" />
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
#left {
  background-image: linear-gradient(
      rgba(27, 154, 252, 0.779),
      rgba(37, 205, 247, 0.621)
    ),
    url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80");
}
</style>
