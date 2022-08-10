<script setup>
import { ref } from "vue";
import RoutineItem from "./RoutineItem.vue";
import Modal from "@/components/ui/Modal.vue";
import CreateRoutine from "@/components/ui/CreateRoutine.vue";
import MainButton from "./MainButton.vue";
import NotFoundResource from "@/components/ui/NotFoundResource.vue";
// const emit = defineEmits(["refreshItems"]);
const isModalOpen = ref(false);
const routinesCollection = ref(null);
const props = defineProps({
  //   collection: {
  //     type: Array,
  //     required: true,
  //   },
  asyncAction: {
    type: Function,
    required: true,
  },
});
const setCollection = async () => {
  routinesCollection.value = await props.asyncAction();
};
await setCollection();
// const testFunc = () => {
//     emit("refreshItems")
//     return routinesCollection
// }

// const collection = ref(routinesCollection.value);
</script>

<template>
  <div>
    <Modal
      :open="isModalOpen"
      header-title="Fitness Routine Creation"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <CreateRoutine
        @close-modal="isModalOpen = !isModalOpen"
        @refresh-items="setCollection"
      />
    </Modal>
    <div class="flex flex-col items-center justify-center w-full">
      <div class="flex flex-col items-center justify-center w-full gap-6 mt-1">
        <h1 class="mt-16 font-bold font-poppins">Fitness Routine Creation</h1>

        <MainButton
          class="w-1/2 text-lg tracking-wider bg-transparent outline outline-primaryBlue"
          button-text="Create Workout Routine"
          @click="isModalOpen = true"
        />
      </div>
      <div class="w-full mt-12">
        <div v-if="!routinesCollection.length" class="p-16 h-1/2">
          <NotFoundResource title="You don't have routines yet." />
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center w-full gap-6 my-20"
        >
          <RoutineItem
            v-for="item in routinesCollection"
            :key="item.id"
            class="w-1/2 bg-green-500 rounded-lg"
            :item="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
