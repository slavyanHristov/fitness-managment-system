<script setup>
import { onMounted, ref, onErrorCaptured } from "vue";
import Modal from "@/components/ui/Modal.vue";
import FinalizeAccount from "@/components/ui/FinalizeAccount.vue";
import UserService from "@/services/API-calls/UserService";
import InstructorDashboardData from "@/components/ui/instructor-components/InstructorDashboardData.vue";
import MultiStepSkeleton from "@/components/skeleton-loaders/MultiStepSkeleton.vue";

const isModalOpen = ref(false);
const userData = ref(null);
const err = ref(null);

onErrorCaptured((e) => {
  err.value = e;
  return true;
});

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
      <div v-if="err">
        <MultiStepSkeleton />
      </div>
      <Suspense>
        <template #default> <InstructorDashboardData /> </template>
        <template #fallback> <MultiStepSkeleton /> </template>
      </Suspense>
    </div>
  </div>
</template>
