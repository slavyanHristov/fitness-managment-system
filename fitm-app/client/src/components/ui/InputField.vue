<script setup>
const props = defineProps([
  "inputType",
  "inputId",
  "inputContent",
  "labelText",
  "inputErrors",
  "failureErrors",
  "vuelidateErrors",
]);
defineEmits(["update:inputContent"]);
</script>

<template>
  <div class="flex flex-col mb-5 bg-inherit">
    <div class="relative bg-inherit">
      <input
        :id="props.inputId"
        class="inputFields"
        :class="[
          {
            errFields: props.inputErrors && props.inputErrors[inputId],
          },
          {
            errFields: props.vuelidateErrors?.length,
          },
          {
            errFields: props.failureErrors,
          },
        ]"
        :type="props.inputType"
        :name="props.inputId"
        placeholder=" "
        autocomplete="off"
        :value="props.inputContent"
        @input="$emit('update:inputContent', $event.target.value)"
      />
      <label id="label-input" class="label bg-inherit" :for="props.inputId">
        {{ props.labelText }}
      </label>
      <div
        v-for="error in props.vuelidateErrors"
        :key="error.$uid"
        class="text-xs text-red-500 font-inter"
      >
        {{ error.$message }}
      </div>
      <div v-if="props.inputErrors && props.inputErrors[inputId]">
        <div
          v-for="err in props.inputErrors[inputId]"
          :key="err.id"
          class="text-xs text-red-500 font-inter"
        >
          {{ err }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 
1. When the input is in the focus state
reduce the size of the label and move upwards 

2. Keep label state when content is in input field 
*/
.inputFields:focus ~ .label,
.inputFields:not(:placeholder-shown).inputFields:not(:focus) ~ .label {
  top: -0.5rem;
  font-size: 0.8rem;
  left: 0.8rem;
}
</style>
