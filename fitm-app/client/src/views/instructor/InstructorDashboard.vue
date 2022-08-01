<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "@/components/ui/Modal.vue";
import FinalizeAccount from "@/components/ui/FinalizeAccount.vue";
import UserService from "@/services/API-calls/UserService";

const router = useRouter();
const isModalOpen = ref(false);
const userData = ref(null);

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
    <div>
      <h1 class="mb-5 text-center text-red-500">Welcome, Instructor!</h1>
      <div class="flex flex-col items-center justify-center gap-4">
        <button @click="router.push({ name: 'createRoutine' })">
          Create Fitness Routine
        </button>
        <button @click="router.push({ name: 'yourClients' })">
          Your Clients
        </button>
      </div>
    </div>
  </div>
</template>
