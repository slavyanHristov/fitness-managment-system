<script setup>
import { computed, onMounted } from "vue";
const props = defineProps([
  "comboBoxName",
  "labelText",
  "collection",
  "selectedItem",
  "vuelidateErrors",
]);
const emit = defineEmits(["update:selectedItem"]);

const value = computed({
  get() {
    return props.selectedItem;
  },
  set(value) {
    emit("update:selectedItem", value);
  },
});

onMounted(() => {
  console.log("Im combo box", props.collection);
});
</script>

<template>
  <div>
    <label class="text-sm font-inter" :for="props.comboBoxName">{{
      props.labelText
    }}</label>
    <select
      v-model="value"
      class="bg-primaryWhite dark:bg-primaryDark appearance-none border border-primaryBlue text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:text-white"
      :class="{
        'border border-red-500 hover:border-red-500 focus:border-red-500':
          props.vuelidateErrors?.length,
      }"
      :name="props.comboBoxName"
    >
      <option v-for="item in props.collection" :key="item.id" :value="item?.id">
        {{ item?.name }}
      </option>
    </select>
    <div
      v-for="error in props.vuelidateErrors"
      :key="error.$uid"
      class="text-xs text-red-500 font-inter"
    >
      {{ error.$message }}
    </div>
  </div>
</template>

<style scoped>
/* Style to add drop down icon*/
select {
  background-image: url("@/assets/icons/drop-down.svg");
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
}
</style>
