<script setup>
import { computed, onMounted } from "vue";
const props = defineProps([
  "labelText",
  "selectedItem",
  "collection",
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
  console.log("Im radio ", props.collection);
});
</script>
<template>
  <div>
    <p class="text-sm font-inter">{{ props.labelText }}</p>
    <div class="flex items-center gap-3">
      <div
        v-for="(item, index) in props.collection"
        :key="index"
        class="flex items-center justify-center"
      >
        <input
          :id="item?.name"
          v-model="value"
          class="w-5 h-5 transition duration-200 bg-white border border-gray-300 rounded-full appearance-none cursor-pointer font-inter checked:bg-blue-600 checked:border-blue-600"
          :value="item?.id"
          type="radio"
        />
        <label class="ml-2" :for="item?.id">{{ item?.name }}</label>
      </div>
    </div>
    <div
      v-for="error in props.vuelidateErrors"
      :key="error.$uid"
      class="text-xs text-red-500 font-inter"
    >
      {{ error.$message }}
    </div>
  </div>
</template>
