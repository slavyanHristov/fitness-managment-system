<script setup>
import { inject, ref } from "vue";
import Modal from "@/components/ui/Modal.vue";
import EditClient from "@/components/ui/instructor-components/EditClient.vue";
const props = defineProps(["item"]);
const emit = defineEmits(["refreshData"]);
const apiUrlPath = inject("apiUrlPath");

const isModalOpen = ref(false);

//TODO: FINISH ME
</script>

<template>
  <div
    v-if="props.item"
    id="container"
    class="h-full overflow-hidden rounded shadow-lg bg-testColor w-80"
  >
    <Modal
      :open="isModalOpen"
      header-title="Edit Client"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <EditClient
        :item-data="props.item"
        @refresh-data="emit('refreshData')"
        @close-modal="isModalOpen = !isModalOpen"
      />
    </Modal>
    <div id="inner">
      <div id="header">
        <img
          class="object-cover w-full max-h-48"
          :src="apiUrlPath + props.item.image.path"
          alt="gym image"
        />
      </div>
      <div id="content">
        <h3>{{ props.item.name }}</h3>
      </div>
      <div id="footer">
        <button @click="isModalOpen = true">Hire</button>
      </div>
    </div>
  </div>
</template>
