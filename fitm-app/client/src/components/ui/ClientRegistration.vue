<script setup>
import { ref, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  sameAs,
  between,
  helpers,
} from "@vuelidate/validators";
import parsePayload from "@/utils/parsePayload";
import SuccessIcon from "../icons/SuccessIcon.vue";
import Toast from "@/components/ui/Toast.vue";

import AuthService from "@/services/API-calls/AuthService";
import MultiStepForm from "@/components/ui/MultiStepForm.vue";
import {
  validatePhone,
  validateFullName,
  validateUsername,
  validatePassword,
} from "@/utils/customValidators";

const errorMessage = ref("");
const errors = ref(null);
const successMessage = ref("");
const fitnessGoals = ref([
  {
    id: 1,
    name: "Muscle Gain",
  },
  {
    id: 2,
    name: "Weight Loss",
  },
  {
    id: 3,
    name: "Maintainance",
  },
]);
const fitnessLevels = ref([
  {
    id: 1,
    name: "Beginner",
  },
  {
    id: 2,
    name: "Novice",
  },
  {
    id: 3,
    name: "Intermediate",
  },
  {
    id: 4,
    name: "Advanced",
  },
]);
const activityLevels = ref([
  {
    id: 1,
    name: "Not Very Active",
  },
  {
    id: 2,
    name: "Lightly Active",
  },
  {
    id: 3,
    name: "Active",
  },
  {
    id: 4,
    name: "Very Active",
  },
]);
const sex = ref([
  {
    id: 1,
    name: "Male",
  },
  {
    id: 2,
    name: "Female",
  },
]);
const user = ref({
  name: {
    label: "Your Full Name",
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
  age: {
    label: "Your age",
    inputId: "age",
    inputType: "number",
    value: "",
  },
  height: {
    label: "Your height (in cm.)",
    inputId: "height",
    inputType: "number",
    value: "",
  },
  weight: {
    label: "Your weight (in kg.)",
    inputId: "weight",
    inputType: "number",
    value: "",
  },
  sex: {
    label: "Sex",
    inputId: "sex",
    radio: {
      collection: sex.value,
    },
  },
  fitnessGoal: {
    label: "Your Fitness Goal",
    inputId: "fitnessGoal",
    comboBox: {
      name: "fitnessGoal",
      collection: fitnessGoals.value,
    },
    value: "",
  },
  fitnessLevel: {
    label: "Your Fitness Level",
    inputId: "fitnessLevel",
    comboBox: {
      name: "fitnessLevel",
      collection: fitnessLevels.value,
    },
    value: "",
  },
  activityLevel: {
    label: "Physical Activity (per. day)",
    inputId: "activityLevel",
    comboBox: {
      name: "activityLevel",
      collection: activityLevels.value,
    },
    value: "",
  },
  country: {
    label: "Country",
    inputId: "country",
    inputType: "text",
    value: "",
  },
  city: {
    label: "City",
    inputId: "city",
    inputType: "text",
    value: "",
  },
  address: {
    label: "Address",
    inputId: "address",
    inputType: "text",
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
        email: helpers.withMessage("Not a valid email!", email),
      },
    },
    age: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        between: helpers.withMessage(
          "Age is not in specified range. (16, 99)",
          between(16, 99)
        ),
      },
    },
    height: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        between: helpers.withMessage(
          "Height is not realistic.",
          between(100, 241)
        ),
      },
    },
    weight: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        between: helpers.withMessage(
          "Given weight is not realistic. (from 35kg to 400kg)",
          between(35, 400)
        ),
      },
    },
    sex: {
      value: {
        required: helpers.withMessage("Please select your sex", required),
      },
    },
    fitnessGoal: {
      value: {
        required: helpers.withMessage("Please select your diet goal", required),
      },
    },
    fitnessLevel: {
      value: {
        required: helpers.withMessage(
          "Please select your estimated fitness level",
          required
        ),
      },
    },
    activityLevel: {
      value: {
        required: helpers.withMessage(
          "Please select an activity level",
          required
        ),
      },
    },
    country: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    city: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    address: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    phone: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        phone: helpers.withMessage(
          "Not a valid phone number format!",
          validatePhone
        ),
      },
    },
  };
});

const v$ = useVuelidate(rules, user);
const steps = ref([
  ["name", "username", "email", "password", "confirmPassword"],
  ["age", "height", "weight", "sex"],
  ["fitnessGoal", "fitnessLevel", "activityLevel"],
  ["country", "city", "address", "phone"],
]);

const registerClient = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const userValues = parsePayload(user.value);
      const response = await AuthService.registerClient(userValues);
      successMessage.value = response.data.message;
      setTimeout(() => {
        successMessage.value = "";
      }, 2000);
      console.log(response);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errors.value = err.response.data.errors;
    }
    console.log(err);
    errorMessage.value =
      "Input errors encountered.Check all steps for detected errors!";
  }
};
</script>
<template>
  <main
    class="flex items-center justify-center flex-auto min-w-full min-h-screen"
  >
    <Toast
      class="top-[55px]"
      :is-toast-active="successMessage"
      toast-type="success"
      :toast-msg="successMessage"
    >
      <template #icon>
        <SuccessIcon />
      </template>
    </Toast>
    <div class="container h-full">
      <div
        class="w-full max-w-full rounded-sm bg-accentWhite dark:bg-accentDark"
      >
        <MultiStepForm
          :vuelidate="v$"
          :db-errors="errors"
          :fields="user"
          :steps="steps"
          @on-submit="registerClient"
        >
          <template #resultMessage>
            <div>
              <div
                v-if="errorMessage"
                class="text-xs text-center text-red-500 font-inter"
              >
                {{ errorMessage }}
              </div>
            </div>
          </template>
        </MultiStepForm>
      </div>
    </div>
  </main>
</template>
