<script setup>
import { ref } from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import InputField from "@/components/ui/InputField.vue";
const gym = ref({
  test: "",
});
</script>

<template>
  <div>
    <h1>Add Gym</h1>
    <div id="form-container">
      <InputField
        inputType="text"
        inputId=""
        v-model:inputContent="gym.test"
        labelText="Test"
      />
      <SubmitButton buttonText="Submit" />
      <form @submit.prevent="createGym"></form>
    </div>
  </div>
</template>
