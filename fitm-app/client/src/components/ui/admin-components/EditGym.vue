<script setup>
import { ref, computed, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, between, maxLength, helpers } from "@vuelidate/validators";
import {
  validatePhone,
  validateTimeFormat,
  validateGymName,
  validateDescription,
  validateFileType,
} from "@/utils/customValidators";
import InputField from "@/components/ui/InputField.vue";
import MainButton from "@/components/ui/MainButton.vue";

import AdminService from "@/services/API-calls/AdminService";

import parsePayload from "@/utils/parsePayload";
import UploadImage from "@/components/ui/UploadImage.vue";

const props = defineProps(["gymData"]);
const emit = defineEmits(["closeModal", "refreshGymData"]);

const foundGymData = ref(props.gymData);
const gymId = foundGymData.value.id;
const errors = ref(null);

const gymFields = ref({
  name: {
    label: "Gym Name",
    inputId: "name",
    inputType: "text",
    value: foundGymData.value.name,
  },
  monthly_cost: {
    label: "Membership Monthly Cost",
    inputId: "monthly_cost",
    inputType: "number",
    value: foundGymData.value.monthly_cost,
  },
  open_at: {
    label: "Gym Opening Time",
    inputId: "open_at",
    inputType: "text",
    value: foundGymData.value.open_at,
  },
  closed_at: {
    label: "Gym Closing Time",
    inputId: "closed_at",
    inputType: "text",
    value: foundGymData.value.closed_at,
  },
  phone: {
    label: "Gym Phone Number",
    inputId: "phone",
    inputType: "number",
    value: foundGymData.value.phone,
  },
  description: {
    label: "Gym Description",
    textArea: true,
    value: foundGymData.value.description,
  },
  gymImgs: {
    label: "Gym Image",
    imgUpload: true,
    value: null,
  },
});

const rules = computed(() => {
  return {
    name: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateGymName: helpers.withMessage(
          "Gym name is not in correct format! Shouldn't contain digits and only certain special characters are allowed (,._+()*'&-)!",
          validateGymName
        ),
      },
    },
    monthly_cost: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        between: helpers.withMessage(
          "Gym membership monthly cost has to be between 30 and 100",
          between(30, 100)
        ),
      },
    },
    open_at: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        validateTimeFormat: helpers.withMessage(
          "Entered time is not in correct format! Should be in 24h convention! (example: 09:30)",
          validateTimeFormat
        ),
      },
    },
    closed_at: {
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
    description: {
      value: {
        validateDescription: helpers.withMessage(
          "Only letters, numbers and (),'',\"\",-,.,, are allowed!",
          validateDescription
        ),
      },
    },
    gymImgs: {
      value: {
        validateFileType: helpers.withMessage(
          "Only image file types are allowed!",
          validateFileType
        ),
        maxLength: helpers.withMessage(
          "Gym can have maximum of four images!",
          maxLength(4)
        ),
      },
    },
  };
});

const v$ = useVuelidate(rules, gymFields);

const appendToFormData = () => {
  const formData = new FormData();
  const formResult = parsePayload(gymFields.value);
  Object.keys(formResult).forEach((key) => {
    if (key === "gymImgs" && formResult[key] !== null) {
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

const editAction = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const formData = appendToFormData();
      const res = await AdminService.updateGym(gymId, formData);
      console.log(res);
      emit("refreshGymData");
      setTimeout(() => emit("closeModal"), 1500);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errors.value = err.response.data.errors;
      console.log(err);
    }
  }
};

const setImages = (images) => {
  gymFields.value.gymImgs.value = images;
};

onMounted(() => {
  console.log("EditGym", foundGymData.value);
  console.log("GymData:", props.gymData);
  console.log("gym id: ", gymId);
});
</script>
<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form
      class="w-96 bg-inherit"
      enctype="multipart/form-data"
      @submit.prevent="editAction"
    >
      <div v-for="(field, index) in gymFields" :key="index" class="bg-inherit">
        <div v-if="field.inputType" class="bg-inherit">
          <InputField
            v-model:inputContent="field.value"
            :label-text="field.label"
            :input-id="field.inputId"
            :input-type="field.inputType"
            :input-errors="errors"
            :vuelidate-errors="v$[field.inputId].$errors"
          />
        </div>
        <div v-else-if="field.textArea">
          <textarea
            v-model="field.value"
            rows="4"
            :class="{ errFields: v$[index].$errors.length }"
            class="mt-6 text-sm resize-none inputFields dark:bg-primaryDark placeholder:text-accentGray"
          ></textarea>
          <div
            v-for="error in v$[index].$errors"
            :key="error.$uid"
            class="text-xs text-red-500 font-inter"
          >
            {{ error.$message }}
          </div>
        </div>
        <div v-else-if="field.imgUpload">
          <UploadImage
            label-text="New Gym Images"
            :vuelidate-errors="v$[index].$errors"
            input-name="gymImages"
            @selected-images="setImages"
          />
        </div>
      </div>
      <MainButton button-text="Submit" />
    </form>
  </div>
</template>
