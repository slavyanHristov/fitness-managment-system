<script setup>
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();
const props = defineProps(["isFlexColumn"]);
defineEmits(["closeMobileNav"]);
</script>

<template>
  <main>
    <div v-if="authStore.isUserLoggedIn" class="flex items-center">
      <div
        v-if="authStore.isCurrentUserAdmin"
        class="flex items-center justify-center gap-2 md:flex-row"
        :class="props.isFlexColumn ? 'flex-col' : 'flex-row'"
      >
        <router-link
          class="router-views"
          :to="{ name: 'adminDashboard' }"
          @click="$emit('closeMobileNav')"
          >Dashboard</router-link
        >
        <router-link
          class="router-views"
          :to="{ name: 'gymsView' }"
          @click="$emit('closeMobileNav')"
          >Gyms</router-link
        >
      </div>
      <div
        v-if="authStore.isCurrentUserManager"
        class="flex items-center justify-center gap-2 md:flex-row"
        :class="props.isFlexColumn ? 'flex-col' : 'flex-row'"
      >
        <router-link
          class="router-views"
          :to="{ name: 'managerDashboard' }"
          @click="$emit('closeMobileNav')"
          >Dashboard</router-link
        >
        <router-link
          class="router-views"
          :to="{ name: 'employeesView' }"
          @click="$emit('closeMobileNav')"
          >Employees</router-link
        >
      </div>
      <div
        v-if="authStore.isCurrentUserInstructor"
        class="flex items-center justify-center gap-2 md:flex-row"
        :class="props.isFlexColumn ? 'flex-col' : 'flex-row'"
      >
        <router-link
          class="router-views"
          :to="{ name: 'instructorDashboard' }"
          @click="$emit('closeMobileNav')"
          >Dashboard</router-link
        >
        <router-link
          class="router-views"
          :to="{ name: 'createRoutine' }"
          @click="$emit('closeMobileNav')"
          >Routines</router-link
        >
        <router-link
          class="router-views"
          :to="{ name: 'yourClients' }"
          @click="$emit('closeMobileNav')"
          >Clients</router-link
        >
      </div>
      <div
        v-if="authStore.isCurrentUserClient"
        class="flex items-center justify-center gap-2 md:flex-row"
        :class="props.isFlexColumn ? 'flex-col' : 'flex-row'"
      >
        <router-link
          class="router-views"
          :to="{ name: 'clientDashboard' }"
          @click="$emit('closeMobileNav')"
          >Dashboard</router-link
        >
        <router-link
          class="router-views"
          :to="{ name: 'clientMealPlan' }"
          @click="$emit('closeMobileNav')"
          >Meal Plan</router-link
        >
        <router-link
          class="router-views"
          :to="{ name: 'clientRoutine' }"
          @click="$emit('closeMobileNav')"
          >Routine</router-link
        >
      </div>
    </div>
  </main>
</template>
