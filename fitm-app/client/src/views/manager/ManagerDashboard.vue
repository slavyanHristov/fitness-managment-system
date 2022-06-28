<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import ManagerAPI from "@/services/axios-instances/ManagerAPI";
import Modal from "@/components/ui/Modal.vue";
import FinalizeAccount from "@/components/ui/FinalizeAccount.vue";
const authStore = useAuthStore();
const isModalOpen = ref(false);
const modalErrorMsg = ref(null);
//get logged in userId from localStorage or pinia store
const userId = authStore.getCurrentUser.userId;
const userData = ref(null);
console.log(userId);
const managerFirstLogin = async () => {
  try {
    const res = await ManagerAPI.getNewManager(userId);
    if (res.data.success) {
      console.log("This is my first login");
      userData.value = res.data.manager;
      isModalOpen.value = true;
    } else {
      console.log("This is not my first login!!!");
    }
  } catch (err) {
    console.log(err);
    return;
  }
};

onMounted(async () => {
  await managerFirstLogin();
});
</script>

<template>
  <div>
    <Modal
      :open="isModalOpen"
      headerTitle="Finalize Account"
      :isClosableModal="false"
    >
      <FinalizeAccount
        :newManagerDetails="userData"
        @closeModal="isModalOpen = !isModalOpen"
      />
    </Modal>
    <h1 class="text-center text-red-500">Manager Dashboard</h1>
  </div>
</template>
