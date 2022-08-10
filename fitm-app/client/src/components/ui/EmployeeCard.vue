<script setup>
import { inject, ref } from "vue";
import Modal from "@/components/ui/Modal.vue";
import EditEmployee from "@/components/ui/EditEmployee.vue";
const props = defineProps(["item"]);
const emit = defineEmits(["refreshEmployees"]);
const apiUrlPath = inject("apiUrlPath");

const isModalOpen = ref(false);
//TODO: Make me white mode
const displayImg = () => {
  if (props.item.fitness_instructor)
    return apiUrlPath + props.item.fitness_instructor.user.image.path;

  return "../src/assets/images/employee-picture.png";
};
</script>

<template>
  <div
    v-if="props.item"
    id="container"
    class="h-full overflow-hidden rounded shadow-lg bg-primaryWhite dark:bg-testColor w-80"
  >
    <Modal
      :open="isModalOpen"
      header-title="Edit Employee"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <EditEmployee
        :item-data="props.item"
        @refresh-employees="emit('refreshEmployees')"
        @close-modal="isModalOpen = !isModalOpen"
      />
    </Modal>
    <div id="inner">
      <div id="header" class="flex justify-center py-1.5">
        <img
          class="object-cover rounded-full max-h-28 max-w-28"
          :src="displayImg()"
          alt="gym image"
        />
      </div>
      <div id="content" class="flex flex-col items-center justify-center">
        <h3 class="font-bold">{{ props.item.name }}</h3>
        <div class="w-full bg-accentWhite dark:bg-accentTestColor">
          <div class="flex items-center justify-center gap-3">
            <img class="w-6 h-6" src="@/assets/icons/salary.svg" alt="" />
            <p class="text-sm">{{ props.item.salary }}</p>
          </div>
          <div class="flex items-center justify-center gap-3">
            <img class="w-6 h-6" src="@/assets/icons/userType.svg" alt="" />
            <p class="text-sm">{{ props.item.position }}</p>
          </div>
          <div class="flex items-center justify-center gap-3">
            <img class="w-6 h-6" src="@/assets/icons/gym.svg" alt="" />
            <p class="text-sm">{{ props.item.gym.name }}</p>
          </div>
        </div>
      </div>
      <div id="footer" class="flex justify-center">
        <button
          class="bg-primaryBlue transition-colors hover:bg-accentBlue text-lg tracking-wider uppercase font-bold p-1.5 w-full"
          @click="isModalOpen = true"
        >
          Details
        </button>
      </div>
    </div>
  </div>
</template>
