<script setup>
import AuthService from "@/services/API-calls/AuthService";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import InputField from "./InputField.vue";

import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers } from "@vuelidate/validators";
import MainButton from "./MainButton.vue";

const props = defineProps(["newManagerDetails"]);
const emit = defineEmits(["closeModal"]);
const authStore = useAuthStore();
const userId = authStore.getCurrentUser.userId;

const user = ref({
  userId: userId,
  name: "",
  password: "",
  confirmPassword: "",
});

onMounted(() => {
  console.log(props.newManagerDetails);
  user.value.name = props.newManagerDetails.name;
});

onUnmounted(async () => {
  console.log("Finalize Account Unmounted");
  // If user tries to bypass account finalization by for example returning to the previous page
  // logout the user
  if (isSuccessful.value === false) {
    await authStore.logout();
  }
});

// window.onbeforeunload = () => {
//   if (isSuccessful.value === false) {
//     return true;
//   }
// };

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Field cannot be empty", required),
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
  };
});

const v$ = useVuelidate(rules, user);
const errors = ref(null);
const isSuccessful = ref(false);
const successMessage = ref("");

const updateAccountDetails = async () => {
  try {
    const hasValidationPassed = await v$.value.$validate();

    if (hasValidationPassed) {
      errors.value = null;
      const res = await AuthService.finalizeAccount(user.value);
      isSuccessful.value = true;
      successMessage.value = res.data.message;
      console.log("Done");
      setTimeout(() => emit("closeModal"), 1500);
    }
  } catch (err) {
    if (err.response && err.response.data)
      errors.value = err.response.data.errors;
    console.log(err);
  }
};
</script>

<template>
  <div class="bg-primaryBgWhite dark:bg-accentDark">
    <form class="w-96 bg-inherit" @submit.prevent="updateAccountDetails">
      <InputField
        v-model:inputContent="user.name"
        input-type="text"
        input-id="name"
        :input-errors="errors"
        :vuelidate-errors="v$.name.$errors"
        label-text="Full Name"
      />
      <InputField
        v-model:inputContent="user.password"
        input-type="password"
        input-id="password"
        :input-errors="errors"
        :vuelidate-errors="v$.password.$errors"
        label-text="Password"
      />
      <InputField
        v-model:inputContent="user.confirmPassword"
        input-type="password"
        input-id="confPassword"
        :input-errors="errors"
        :vuelidate-errors="v$.confirmPassword.$errors"
        label-text="Confirm Password"
      />
      <div
        v-if="isSuccessful"
        class="mb-5 text-xs text-center text-green-500 font-inter"
      >
        {{ successMessage }}
      </div>
      <MainButton button-text="Continue" />
    </form>
  </div>
</template>
