<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import parsePayload from "@/utils/parsePayload";
import WarningIcon from "@/components/icons/WarningIcon.vue";
import SuccessIcon from "../icons/SuccessIcon.vue";

import Toast from "@/components/ui/Toast.vue";

import ManagerService from "@/services/API-calls/ManagerService";
import MultiStepForm from "@/components/ui/MultiStepForm.vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";
import {
  validatePhone,
  validateSalary,
  validateTimeFormat,
  validateFullName,
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
const employeePosition = ref([
  {
    id: 2,
    name: "Receptionist",
  },
  {
    id: 3,
    name: "Technician",
  },
]);
const employee = ref({
  name: {
    label: "Full Name",
    inputId: "name",
    inputType: "text",
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
  position: {
    label: "Employee Position",
    inputId: "position",
    comboBox: {
      name: "position",
      collection: employeePosition.value,
    },
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
    position: {
      value: {
        required: helpers.withMessage(
          "Please select working position for your new employee",
          required
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

const v$ = useVuelidate(rules, employee);
const steps = ref([
  ["name", "position", "gymId"],
  ["shift_start", "shift_end"],
  ["salary", "phone"],
]);

const showToastAndRedirect = (type, message, pageToRedirect) => {
  toastType.value = type;
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const createEmployee = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const employeeValues = parsePayload(employee.value);
      const response = await ManagerService.registerEmployee(employeeValues);
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
    employee.value.gymId.comboBox.collection = gyms.value;
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
            :fields="employee"
            :steps="steps"
            @on-submit="createEmployee"
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
