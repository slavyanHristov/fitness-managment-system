<script setup>
import AutoLogout from "@/components/AutoLogout.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import AdminAPI from "../../services/axios-instances/AdminAPI";
import { useAuthStore } from "../../stores/authStore";
const router = useRouter();
const authStore = useAuthStore();

const content = ref(null);

const testProtectedAction = () => {
  AdminAPI.getGyms().then(
    (response) => {
      content.value = response.data;
      console.log(content.value);
    },
    (error) => {
      console.log(error);
      // content.value = error.response.data.message;
    }
  );
};
</script>

<template>
  <div>
    <!-- <AutoLogout /> -->
    <div>
      <h1 class="text-center text-red-500">Welcome, Admin!</h1>
      <button
        class="px-2 mt-2 border border-solid rounded border-primaryBlue"
        @click="testProtectedAction"
      >
        Protected route (ALL MANAGERS)
      </button>
      <div v-if="content !== null"></div>
      {{ content }}
    </div>
    <router-link :to="{ name: 'registerManager' }"
      >Register Manager</router-link
    >
    <router-link :to="{ name: 'addGym' }">Add Gym</router-link>
  </div>
</template>
