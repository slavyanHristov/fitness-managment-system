<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import parsePayload from "@/utils/parsePayload";
import WarningIcon from "@/components/icons/WarningIcon.vue";
import SuccessIcon from "../icons/SuccessIcon.vue";
import Toast from "@/components/ui/Toast.vue";

import ManagerService from "@/services/API-calls/ManagerService";
import MultiStepForm from "@/components/ui/MultiStepForm.vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import {
  validatePhone,
  validateFullName,
  validateUsername,
  validatePassword,
  validateSalary,
  validateTimeFormat,
} from "@/utils/customValidators";

const router = useRouter();
const authStore = useAuthStore();
const authManager = authStore.getCurrentUser.userRole;

const noGyms = ref(false);
const errorMessage = ref("");
const errors = ref(null);
const toastType = ref(null);
const toastMsg = ref("");
let redirectTimer = null;

const user = ref({
  name: {
    label: "Full Name",
    inputId: "name",
    inputType: "text",
    value: "",
  },
  username: {
    label: "Username",
    inputId: "username",
    inputType: "type",
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
    inputType: "number", // TODO: Can i change this to number?
    value: "",
  },
  shift_start: {
    label: "Working Shift Start Time",
    inputId: "shift_start",
    inputType: "text",
    value: "",
  },
  shift_end: {
    label: "Working Shift End Time",
    inputId: "shift_end",
    inputType: "text",
    value: "",
  },
  gymId: {
    label: "Select Gym",
    inputId: "gymId",
    comboBox: {
      name: "managers",
      collection: null,
    },
    value: "",
  },
});

//TODO: Add custom validations!

const rules = computed(() => {
  return {
    name: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateFullName: helpers.withMessage(
          "Your name isn't in correct format!",
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
    salary: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateSalary: helpers.withMessage(
          "Salary is not valid(should be between 3 and 4 digit length)",
          validateSalary
        ),
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
    shift_start: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateTimeFormat: helpers.withMessage(
          "Entered time is not in correct format! Should be in 24h convention! (example: 09:30)",
          validateTimeFormat
        ),
      },
    },
    shift_end: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateTimeFormat: helpers.withMessage(
          "Entered time is not in correct format! Should be in 24h convention! (example: 17:30)",
          validateTimeFormat
        ),
      },
    },
    gymId: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
  };
});

const gyms = ref(null);

const v$ = useVuelidate(rules, user);
const steps = ref([
  ["name", "username", "password", "confirmPassword"],
  ["email", "salary", "gymId"],
  ["shift_start", "shift_end", "phone"],
]);

const showToastAndRedirect = (type, message, pageToRedirect) => {
  toastType.value = type;
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const createInstructor = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const userValues = parsePayload(user.value);
      const response = await ManagerService.registerInstructor(userValues);
      showToastAndRedirect(
        "success",
        response.data.message,
        "managerDashboard"
      );
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

const getManagedGyms = async () => {
  try {
    const response = await ManagerService.getYourGyms(authManager.id);
    gyms.value = response.data.managedGyms;
    user.value.gymId.comboBox.collection = gyms.value;
    console.log(gyms.value);
  } catch (err) {
    noGyms.value = true;
    if (err.response && err.response.data) {
      showToastAndRedirect(
        "warning",
        "No gyms in the system. You'll be redirected.",
        "managerDashboard"
      );
    }
    console.log(err);
  }
};

await getManagedGyms();

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});
</script>

<template>
  <main
    class="flex items-center justify-center flex-auto min-w-full min-h-screen"
  >
    <Toast
      class="top-[55px]"
      :is-toast-active="toastMsg"
      :toast-type="toastType"
      :toast-msg="toastMsg"
    >
      <template #icon>
        <WarningIcon v-if="toastType === 'warning'" />
        <SuccessIcon v-if="toastType === 'success'" />
      </template>
    </Toast>
    <div class="container h-full">
      <div class="flex items-center justify-center min-h-screen">
        <div
          class="w-full max-w-3xl rounded-sm bg-accentWhite dark:bg-accentDark"
        >
          <MultiStepSkeleton v-if="noGyms" />
          <MultiStepForm
            v-else
            :vuelidate="v$"
            :db-errors="errors"
            :fields="user"
            :steps="steps"
            @on-submit="createInstructor"
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
    </div>
  </main>
</template>
