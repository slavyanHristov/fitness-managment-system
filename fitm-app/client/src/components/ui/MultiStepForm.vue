<script setup>
import { ref, computed } from "vue";
import FormStepsIndicator from "@/components/ui/FormStepsIndicator.vue";
import InputField from "@/components/ui/InputField.vue";
import ComboBox from "@/components/ui/ComboBox.vue";
import MainButton from "@/components/ui/MainButton.vue";
import UploadImage from "@/components/ui/UploadImage.vue";
import RadioButtons from "@/components/ui/RadioButtons.vue";
const props = defineProps([
  "vuelidate",
  "dbErrors",
  "fields",
  "steps",
  "comboBoxItems",
]);
defineEmits(["on-submit", "on-selected-images"]);
const myFields = ref(props.fields);

const setImages = (images) => {
  myFields.value.multiFiles.value = images;
};

const currentStep = ref(0);

const totalSteps = computed(() => {
  return props.steps.length;
});
const isFirstStep = computed(() => {
  return currentStep.value === 0;
});
const isLastStep = computed(() => {
  return currentStep.value === totalSteps.value - 1;
});
const currentFields = computed(() => {
  return props.steps[currentStep.value];
});

const validateKeys = (isValid) => {
  currentFields.value.forEach((key) => {
    props.vuelidate[key].$touch(); // validate given field
    if (props.vuelidate[key].$errors.length) {
      // if there are any errors set isValid boolean to false
      isValid = false;
    }
  });
  return isValid;
};

const nextStep = () => {
  if (isLastStep.value) return;
  let isValid = true;
  if (validateKeys(isValid)) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (isFirstStep.value) return;
  currentStep.value--;
};
</script>

<template>
  <div>
    <div id="form-container" class="px-6 py-8">
      <form class="" enctype="multipart/form-data" @submit.prevent="">
        <FormStepsIndicator
          class="w-4/5 m-auto mb-12"
          :total-steps="totalSteps"
          :current-step="currentStep"
        />
        <div
          v-for="(fieldKeys, step) in steps"
          :key="step"
          class="bg-accentWhite dark:bg-accentDark"
        >
          <div v-if="currentStep === step" class="bg-inherit">
            <div v-for="field in fieldKeys" :key="field.id" class="bg-inherit">
              <div v-if="myFields[field].inputType" class="bg-inherit">
                <InputField
                  v-model:inputContent="myFields[field].value"
                  :input-type="myFields[field].inputType"
                  :input-id="myFields[field].inputId"
                  :input-errors="props.dbErrors"
                  :vuelidate-errors="props.vuelidate[field].$errors"
                  :label-text="myFields[field].label"
                />
              </div>
              <div v-else-if="myFields[field].comboBox">
                <ComboBox
                  v-model:selectedItem="myFields[field].value"
                  :combo-box-name="myFields[field].comboBox.name"
                  :label-text="myFields[field].label"
                  :collection="myFields[field].comboBox.collection"
                  :vuelidate-errors="props.vuelidate[field].$errors"
                />
              </div>
              <div v-else-if="myFields[field].imgUpload">
                <UploadImage
                  label-text="Gym Images"
                  :vuelidate-errors="props.vuelidate[field].$errors"
                  input-name="gymImages"
                  @selected-images="setImages"
                />
              </div>
              <div v-else-if="myFields[field].radio">
                <RadioButtons
                  v-model:selectedItem="myFields[field].value"
                  :collection="myFields[field].radio.collection"
                  :label-text="myFields[field].label"
                  :vuelidate-errors="props.vuelidate[field].$errors"
                />
              </div>
              <div v-else-if="myFields[field].textArea">
                <textarea
                  v-model="myFields[field].value"
                  rows="4"
                  placeholder="Add additional information about the gym..."
                  :class="{ errFields: props.vuelidate[field].$errors.length }"
                  class="mt-6 text-sm resize-none inputFields dark:bg-primaryDark placeholder:text-accentGray"
                ></textarea>
                <div
                  v-for="error in props.vuelidate[field].$errors"
                  :key="error.$uid"
                  class="text-xs text-red-500 font-inter"
                >
                  {{ error.$message }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <slot name="resultMessage"></slot>
        <div
          id="buttons"
          class="flex flex-row-reverse justify-start gap-2 mt-12"
        >
          <MainButton
            v-if="isLastStep"
            button-text="Submit"
            @click.prevent="$emit('on-submit')"
          />
          <MainButton
            v-if="!isLastStep"
            button-text="Next"
            @click.prevent="nextStep"
          />
          <MainButton
            v-if="!isFirstStep"
            class="bg-accentGray hover:bg-accentDark"
            button-text="Previous"
            @click.prevent="previousStep"
          />
        </div>
      </form>
    </div>
  </div>
</template>
