<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import UserService from "@/services/API-calls/UserService";
import Modal from "@/components/ui/Modal.vue";
import FinalizeAccount from "@/components/ui/FinalizeAccount.vue";

const router = useRouter();
const authStore = useAuthStore();

const isModalOpen = ref(false);
//get logged in userId from localStorage or pinia store
const userId = authStore.getCurrentUser.userId;
const userData = ref(null);
console.log(userId);
const isUserFinalized = async () => {
  try {
    const res = await UserService.getNewUser();
    if (res.data.success) {
      console.log("This is my first login");
      userData.value = res.data.newUser;
      console.log("USERDATA:", userData.value);
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
  await isUserFinalized();
});
</script>

<template>
  <div>
    <Modal
      :open="isModalOpen"
      header-title="Finalize Account"
      :is-closable-modal="false"
    >
      <FinalizeAccount
        :new-manager-details="userData"
        @close-modal="isModalOpen = !isModalOpen"
      />
    </Modal>
    <div class="flex flex-col gap-4">
      <h1 class="text-center text-red-500">Manager Dashboard</h1>
      <button @click="router.push({ name: 'registerInstructor' })">
        Register Instructor
      </button>
      <button @click="router.push({ name: 'registerEmployee' })">
        Register Employee
      </button>
      <button @click="router.push({ name: 'employeesView' })">
        My Employees
      </button>
    </div>
  </div>
</template>
