<script setup>
import { ref, computed, onUnmounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, between, maxLength } from "@vuelidate/validators";
import MultiStepForm from "@/components/ui/MultiStepForm.vue";
import { useRouter } from "vue-router";
import AdminService from "@/services/API-calls/AdminService";
import Toast from "@/components/ui/Toast.vue";
import parsePayload from "@/utils/parsePayload";
import WarningIcon from "@/components/icons/WarningIcon.vue";
import SuccessIcon from "@/components/icons/SuccessIcon.vue";
import MultiStepSkeleton from "../skeleton-loaders/MultiStepSkeleton.vue";
import {
  validateTimeFormat,
  validateDescription,
  validateGymName,
  validatePhone,
  validateFileType,
} from "@/utils/customValidators";

const router = useRouter();

const toastMsg = ref("");
const toastType = ref(null);
const noManagers = ref(false);
const errorMessage = ref(null);
const errors = ref(null);
let redirectTimer = null;
const fields = ref({
  gymName: {
    label: "Gym Name",
    inputId: "gymName",
    inputType: "text",
    value: "",
  },
  monthlyCost: {
    label: "Membership Monthly Cost",
    inputId: "monthlyCost",
    inputType: "number",
    value: "",
  },
  size: {
    label: "Gym Size",
    inputId: "size",
    inputType: "number",
    value: "",
  },
  openAt: {
    label: "Gym Opening Time",
    inputId: "openAt",
    inputType: "text",
    value: "",
  },
  closedAt: {
    label: "Gym Closing Time",
    inputId: "closedAt",
    inputType: "text",
    value: "",
  },
  phone: {
    label: "Gym Phone Number",
    inputId: "phone",
    inputType: "text",
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
    label: "Address Name",
    inputId: "address",
    inputType: "text",
    value: "",
  },
  managerId: {
    label: "Select Manager",
    comboBox: {
      name: "managers",
      collection: null,
    },
    value: "",
  },
  multiFiles: {
    label: "Gym Image",
    imgUpload: true,
    value: null,
  },
  description: {
    label: "Gym Description",
    textArea: true,
    value: "",
  },
});

const requiredFile = () => {
  if (fields.value.multiFiles.value.length === 0) {
    return false;
  }
  return true;
};

// const validateFileType = (value) => {
//   if (!value) {
//     return true;
//   }
//   let selectedFiles = value;
//   let isImage = true;
//   Object.keys(selectedFiles).forEach((file) => {
//     console.log("file", selectedFiles[file]);
//     if (!selectedFiles[file].type.startsWith("image")) {
//       isImage = false;
//     }
//   });
//   return isImage;
// };

const rules = computed(() => {
  return {
    gymName: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateGymName: helpers.withMessage(
          "Gym name is not in correct format! Shouldn't contain digits and only certain special characters are allowed (,._+()*'&-)!",
          validateGymName
        ),
      },
    },
    monthlyCost: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        between: helpers.withMessage(
          "Gym membership monthly cost has to be between 30 and 100",
          between(30, 100)
        ),
      },
    },
    size: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
      },
    },
    openAt: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateTimeFormat: helpers.withMessage(
          "Entered time is not in correct format! Should be in 24h convention! (example: 09:30)",
          validateTimeFormat
        ),
      },
    },
    closedAt: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateTimeFormat: helpers.withMessage(
          "Entered time is not in correct format! Should be in 24h convention! (example: 21:30)",
          validateTimeFormat
        ),
      },
    },
    phone: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validatePhone: helpers.withMessage(
          "Not a valid phone number format!",
          validatePhone
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
    managerId: {
      value: {
        required: helpers.withMessage("Please select a manager", required),
      },
    },
    multiFiles: {
      value: {
        validateFileType: helpers.withMessage(
          "Only image file types are allowed!",
          validateFileType
        ),
        maxLength: helpers.withMessage(
          "You can upload maxiumum 4 images at a time!",
          maxLength(4)
        ),
      },
      requiredFile: helpers.withMessage(
        "You need to upload at least one image!",
        requiredFile
      ),
    },
    description: {
      value: {
        validateDescription: helpers.withMessage(
          "Only letters, numbers and (),'',\"\",-,.,, are allowed!",
          validateDescription
        ),
      },
    },
  };
});
const managers = ref(null);
let flattenedManagers = ref(null);
const v$ = useVuelidate(rules, fields);
const steps = ref([
  ["gymName", "monthlyCost", "size"],
  ["openAt", "closedAt", "phone"],
  ["country", "city", "address"],
  ["managerId", "multiFiles", "description"],
]);

const flattenUserObject = (userObject) => {
  const flattened = {};

  Object.keys(userObject).forEach((key) => {
    const value = userObject[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenUserObject(value));
    } else {
      flattened[key] = value;
    }
  });

  return flattened;
};
const showToastAndRedirect = (type, message, pageToRedirect) => {
  toastType.value = type;
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};
const getManagers = async () => {
  try {
    const response = await AdminService.getAllManagers();
    console.log(response.data.allManagers);
    managers.value = response.data.allManagers;
    flattenedManagers.value = managers.value.map((item) => {
      return flattenUserObject(item);
    });
    console.log("flattened", flattenedManagers.value);
    fields.value.managerId.comboBox.collection = flattenedManagers.value;
  } catch (err) {
    noManagers.value = true;
    if (err.response && err.response.data) {
      console.log(err);
      showToastAndRedirect(
        "warning",
        "No managers in the system. You'll be redirected.",
        "registerManager"
      );
    }
  }
};

await getManagers();

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});

const appendToFormData = () => {
  const formData = new FormData();
  const formResult = parsePayload(fields.value);
  Object.keys(formResult).forEach((key) => {
    if (key === "multiFiles") {
      const imgFiles = [...formResult[key]];
      imgFiles.forEach((img) => {
        formData.append(key, img);
      });
    } else {
      formData.append(key, formResult[key]);
    }
  });
  return formData;
};

const createGym = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const formData = appendToFormData();
      const response = await AdminService.registerGym(formData);
      // isSuccessful.value = true;
      // successMessage.value = response.data.message;
      console.log(response);
      showToastAndRedirect("success", response.data.message, "adminDashboard");
      // toastType.value = "success";
      // toastMsg.value = response.data.message;
      // redirectTimer = setTimeout(() => {
      //   toastMsg.value = "";
      //   router.push({ name: "adminDashboard" });
      // }, 1500);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errors.value = err.response.data.errors;
    }
    console.log(err);
    errorMessage.value = "Oops. Something went wrong...";
  }
};
</script>

<template>
  <main class="flex items-center justify-center min-w-full min-h-screen">
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
    <MultiStepSkeleton v-if="noManagers" />
    <div v-else class="grid w-10/12 grid-cols-1 lg:grid-cols-2">
      <div
        id="form"
        class="flex flex-col items-center justify-center rounded-lg bg-accentWhite dark:bg-accentDark"
      >
        <MultiStepForm
          :vuelidate="v$"
          :db-errors="errors"
          :fields="fields"
          :steps="steps"
          :combo-box-items="flattenedManagers"
          @on-submit="createGym"
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
      <div
        id="cover"
        class="hidden lg:flex rounded-r-md flex-col items-center justify-center min-h-[80vh]"
      >
        <div>
          <h1 class="text-5xl font-bold uppercase text-primaryWhite">
            Register Gym
          </h1>
          <p class="mt-2 text-center text-primaryWhite">
            Gym addition to the system
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
#cover {
  background-image: linear-gradient(
      rgba(27, 154, 252, 0.1),
      rgba(37, 205, 247, 0.1)
    ),
    url("@/assets/images/addGym.jpg");
  background-position: center;
  background-size: cover;
}
</style>
