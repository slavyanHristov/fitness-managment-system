<script setup>
import { inject, ref } from "vue";
import Modal from "@/components/ui/Modal.vue";
import EditClient from "@/components/ui/instructor-components/EditClient.vue";
import MealPlanCreation from "@/components/ui/instructor-components/MealPlanCreation.vue";
const props = defineProps(["item"]);
const emit = defineEmits(["refreshData"]);
const apiUrlPath = inject("apiUrlPath");

const isModalOpen = ref(false);
const modalHeader = ref("");

const openEditClient = () => {
  modalHeader.value = "Edit Client";
  isModalOpen.value = true;
};
const openMealPlanCreate = () => {
  modalHeader.value = "Meal Plan Creation";
  isModalOpen.value = true;
};

console.log(props.item);
//TODO: FINISH ME
</script>

<template>
  <div
    v-if="props.item"
    id="container"
    class="h-full overflow-hidden rounded shadow-lg dark:bg-testColor w-80"
  >
    <Modal
      :open="isModalOpen"
      :header-title="modalHeader"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <EditClient
        v-if="modalHeader === 'Edit Client'"
        :item-data="props.item"
        @refresh-data="emit('refreshData')"
        @close-modal="isModalOpen = !isModalOpen"
      />
      <MealPlanCreation
        v-else
        :item-data="props.item"
        @refresh-data="emit('refreshData')"
        @close-modal="isModalOpen = !isModalOpen"
      />
    </Modal>
    <div id="inner">
      <div id="header" class="flex justify-center py-1.5">
        <img
          class="object-cover rounded-full max-h-28 max-w-28"
          :src="apiUrlPath + props.item.image.path"
          alt="gym image"
        />
      </div>
      <div id="content" class="flex flex-col items-center justify-center">
        <h3 class="my-2 font-bold">{{ props.item.name }}</h3>
      </div>
      <div id="footer" class="flex flex-col items-center justify-center gap-2">
        <button
          class="w-full text-lg font-bold tracking-wider uppercase transition-colors rounded-full bg-primaryBlue hover:bg-accentBlue"
          @click="openEditClient()"
        >
          Edit
        </button>
        <button
          v-if="props.item.mealPlanId === null"
          class="w-full mb-2 text-lg font-bold tracking-wider uppercase transition-colors rounded-full bg-primaryGreen hover:bg-accentGreen"
          @click="openMealPlanCreate()"
        >
          Create Meal Plan
        </button>
      </div>
    </div>
  </div>
</template>
