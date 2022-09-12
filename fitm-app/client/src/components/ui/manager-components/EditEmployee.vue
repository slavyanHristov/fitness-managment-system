<script setup>
import { ref, computed, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, between, helpers } from "@vuelidate/validators";
import { validatePhone, validateTimeFormat } from "@/utils/customValidators";

import ManagerService from "@/services/API-calls/ManagerService";

import InputField from "@/components/ui/InputField.vue";
import MainButton from "@/components/ui/MainButton.vue";
import parsePayload from "@/utils/parsePayload";

const props = defineProps(["itemData"]);
const emit = defineEmits(["closeModal", "refreshEmployees"]);
const employeeId = props.itemData.id;

const myVal = computed(() => {
  return props.itemData;
});

const errors = ref(null);
console.log(myVal);
const employeeFields = ref({
  salary: {
    label: "Salary",
    inputId: "salary",
    inputType: "number",
    value: props.itemData.salary,
  },
  phone: {
    label: "Phone Number",
    inputId: "phone",
    inputType: "number",
    value: props.itemData.phone,
  },
  shift_start: {
    label: "Working Shift Start Time",
    inputId: "shift_start",
    inputType: "text",
    value: props.itemData.shift_start,
  },
  shift_end: {
    label: "Working Shift End Time",
    inputId: "shift_end",
    inputType: "text",
    value: props.itemData.shift_end,
  },
});

const rules = computed(() => {
  return {
    salary: {
      value: {
        required: helpers.withMessage("Field cannot be empty", required),
        between: helpers.withMessage(
          "Salary has to be between 500 and 500",
          between(500, 5000)
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
  };
});

const v$ = useVuelidate(rules, employeeFields);

const editAction = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();
    if (hasValidationPassed) {
      const res = await ManagerService.updateEmployee(
        employeeId,
        parsePayload(employeeFields.value)
      );
      console.log(res);
      emit("refreshEmployees");
      setTimeout(() => emit("closeModal"), 1500);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errors.value = err.response.data.errors;
      console.log(err);
    }
  }
};

onMounted(() => {
  console.log(employeeId);
});
</script>
<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form
      class="flex flex-col justify-center gap-2 w-96 bg-inherit"
      @submit.prevent="editAction"
    >
      <div
        v-for="(field, index) in employeeFields"
        :key="index"
        class="bg-inherit"
      >
        <div v-if="field.inputType" class="bg-inherit">
          <p class="text-xs">{{ field.label }}</p>
          <InputField
            v-model:inputContent="field.value"
            :input-id="employeeFields[field.inputId]"
            :input-type="field.inputType"
            :input-errors="errors"
            :vuelidate-errors="v$[field.inputId].$errors"
          />
        </div>
      </div>
      <MainButton button-text="Submit" />
    </form>
  </div>
</template>
