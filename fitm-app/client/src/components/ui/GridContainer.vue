<script setup>
const props = defineProps(["collection", "filteredCollection"]);
</script>

<template>
  <div
    v-if="props.collection"
    class="grid gap-4 p-5 m-5 rounded-lg place-items-center sm:grid-cols-2 lg:grid-cols-3 bg-accentDark"
  >
    <div v-if="!props.filteredCollection.length" class="col-span-3">
      No Result
    </div>
    <div v-for="item in props.filteredCollection" :key="item.id">
      <slot :item="item" name="card"></slot>
    </div>
  </div>
</template>
