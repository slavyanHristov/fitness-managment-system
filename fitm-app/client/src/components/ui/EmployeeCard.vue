<script setup>
import { inject, ref } from "vue";
import Modal from "@/components/ui/Modal.vue";
import EditEmployee from "@/components/ui/EditEmployee.vue";
const props = defineProps(["item"]);
const emit = defineEmits(["refreshEmployees"]);
const apiUrlPath = inject("apiUrlPath");

const isModalOpen = ref(false);

const displayImg = () => {
  if (props.item.fitness_instructor)
    return apiUrlPath + props.item.fitness_instructor.user.image.path;

  return "../src/assets/images/gym_pic1.avif";
};
</script>

<template>
  <div
    v-if="props.item"
    id="container"
    class="h-full overflow-hidden rounded shadow-lg bg-testColor w-80"
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
      <div id="header">
        <img
          class="object-cover w-full max-h-48"
          :src="displayImg()"
          alt="gym image"
        />
      </div>
      <div id="content">
        <h3>{{ props.item.name }}</h3>
        <p>{{ props.item.salary }}</p>
        <p>{{ props.item.position }}</p>
        <p>{{ props.item.gym.name }}</p>
      </div>
      <div id="footer">
        <button @click="isModalOpen = true">Details</button>
      </div>
    </div>
  </div>
</template>
